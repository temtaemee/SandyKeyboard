package com.kh.app.product.stay.service;

import com.kh.app.product.common.util.S3PictureUploader;
import com.kh.app.product.exception.ErrorCode;
import com.kh.app.product.exception.ProductException;
import com.kh.app.product.space.repository.SpaceRepository;
import com.kh.app.product.stay.dto.request.StayExtraPriceReqDto;
import com.kh.app.product.stay.dto.request.StayInsertReqDto;
import com.kh.app.product.stay.dto.request.StaySearchReqDto;
import com.kh.app.product.stay.dto.request.StayUpdateReqDto;
import com.kh.app.product.stay.dto.response.StayResDto;
import com.kh.app.product.stay.entity.*;
import com.kh.app.product.stay.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
public class StayService {

    private final StayRepository stayRepository;
    private final StayPictureRepository stayPictureRepository;
    private final StayOptionRepository stayOptionRepository;
    private final StayExtraPriceRepository stayExtraPriceRepository;
    private final SpaceRepository spaceRepository;
    private final S3PictureUploader s3PictureUploader;

    public List<StayResDto> searchList(StaySearchReqDto dto) {
        return stayRepository.searchList(dto).stream()
                .map(stay -> {
                    List<StayPictureEntity> pictures = stayPictureRepository.findByStayOrderBySortOrder(stay);
                    List<StayOption> options = stayOptionRepository.findByStay(stay).stream()
                            .map(StayOptionEntity::getStayOption).toList();
                    return StayResDto.from(stay, options, pictures);
                })
                .toList();
    }

    public StayResDto selectOne(Long id) {
        StayEntity stay = findStay(id);
        List<StayPictureEntity> pictures = stayPictureRepository.findByStayOrderBySortOrder(stay);
        List<StayOption> options = stayOptionRepository.findByStay(stay).stream()
                .map(StayOptionEntity::getStayOption).toList();
        return StayResDto.from(stay, options, pictures);
    }

    @Transactional
    public Long insert(StayInsertReqDto dto, List<MultipartFile> files) {
        var space = spaceRepository.findByIdAndDelYn(dto.getSpaceId(), "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));

        validateCheckInOutTime(dto.getCheckInTime(), dto.getCheckOutTime());

        StayEntity stay = stayRepository.save(dto.toEntity(space));
        insertOptions(stay, dto.getOptionList());
        insertExtraPrices(stay, stay.getId(), dto.getExtraPriceList());
        uploadAndSavePictures(stay, files);

        return stay.getId();
    }

    @Transactional
    public void update(Long id, StayUpdateReqDto dto) {
        StayEntity stay = findStay(id);

        validateCheckInOutTime(dto.getCheckInTime(), dto.getCheckOutTime());

        stay.update(
                dto.getName(), dto.getSummary(), dto.getDescription(),
                dto.getCapacity(), dto.getMaxCapa(),
                dto.getCheckInTime(), dto.getCheckOutTime(),
                dto.getMonPrice(), dto.getTuePrice(), dto.getWedPrice(), dto.getThuPrice(),
                dto.getFriPrice(), dto.getSatPrice(), dto.getSunPrice(), dto.getHolidayPrice(),
                dto.getWorkationYn()
        );
        stayOptionRepository.deleteAllByStay(stay);
        insertOptions(stay, dto.getOptionList());
    }

    @Transactional
    public void changeVisibleYn(Long id, String visibleYn) {
        findStay(id).changeVisibleYn(visibleYn);
    }

    @Transactional
    public void delete(Long id) {
        findStay(id).delete();
    }

    private StayEntity findStay(Long id) {
        return stayRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.STAY_NOT_FOUND));
    }

    private void insertOptions(StayEntity stay, List<StayOption> optionList) {
        if (optionList == null || optionList.isEmpty()) return;
        List<StayOptionEntity> entities = optionList.stream()
                .map(opt -> StayOptionEntity.builder().stay(stay).stayOption(opt).build())
                .toList();
        stayOptionRepository.saveAll(entities);
    }

    /**
     * ExtraPrice 등록 전 날짜 overlap 검사를 수행한다.
     * 1) 새로 등록하는 목록 내부에서 서로 겹치는지 확인
     * 2) 같은 stayId의 기존 추가금액과 겹치는지 확인
     */
    private void insertExtraPrices(StayEntity stay, Long stayId, List<StayExtraPriceReqDto> extraPriceList) {
        if (extraPriceList == null || extraPriceList.isEmpty()) return;

        // 1) 입력 목록 내부 overlap 검사
        for (int i = 0; i < extraPriceList.size(); i++) {
            StayExtraPriceReqDto a = extraPriceList.get(i);
            for (int j = i + 1; j < extraPriceList.size(); j++) {
                StayExtraPriceReqDto b = extraPriceList.get(j);
                if (isOverlapping(a.getStartDate(), a.getEndDate(), b.getStartDate(), b.getEndDate())) {
                    throw new IllegalArgumentException("추가 금액 날짜 범위가 기존 설정과 겹칩니다.");
                }
            }
        }

        // 2) DB에 저장된 기존 ExtraPrice와의 overlap 검사
        for (StayExtraPriceReqDto dto : extraPriceList) {
            List<StayExtraPriceEntity> conflicts = stayExtraPriceRepository.findOverlapping(
                    stayId, dto.getStartDate(), dto.getEndDate());
            if (!conflicts.isEmpty()) {
                throw new IllegalArgumentException("추가 금액 날짜 범위가 기존 설정과 겹칩니다.");
            }
        }

        List<StayExtraPriceEntity> entities = extraPriceList.stream()
                .map(dto -> dto.toEntity(stay))
                .toList();
        stayExtraPriceRepository.saveAll(entities);
    }

    /** 두 날짜 구간이 겹치는지 확인한다. */
    private boolean isOverlapping(
            java.time.LocalDateTime startA, java.time.LocalDateTime endA,
            java.time.LocalDateTime startB, java.time.LocalDateTime endB
    ) {
        return startA != null && endA != null && startB != null && endB != null
                && !startA.isAfter(endB) && !endA.isBefore(startB);
    }

    /** 체크인 시간이 체크아웃 시간보다 빠른지 검사한다. */
    private void validateCheckInOutTime(java.time.LocalTime checkInTime, java.time.LocalTime checkOutTime) {
        if (checkInTime != null && checkOutTime != null
                && !checkInTime.isBefore(checkOutTime)) {
            throw new IllegalArgumentException("체크인 시간은 체크아웃 시간보다 빨라야 합니다.");
        }
    }

    private void uploadAndSavePictures(StayEntity stay, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return;

        List<String> s3Keys = s3PictureUploader.upload(files, "stay");

        List<StayPictureEntity> entities = new ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String s3Key = s3Keys.get(i);
            String storedName = s3Key.substring(s3Key.lastIndexOf("/") + 1);
            entities.add(StayPictureEntity.builder()
                    .stay(stay)
                    .filePath(s3Key)
                    .originName(file.getOriginalFilename())
                    .storedName(storedName)
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .mainYn(i == 0 ? "Y" : "N")
                    .sortOrder(i)
                    .build());
        }
        stayPictureRepository.saveAll(entities);
    }
}
