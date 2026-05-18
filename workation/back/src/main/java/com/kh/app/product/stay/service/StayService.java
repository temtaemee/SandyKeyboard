package com.kh.app.product.stay.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.product.exception.ErrorCode;
import com.kh.app.product.exception.ProductException;
import com.kh.app.product.space.entity.SpacePictureCategory;
import com.kh.app.product.space.repository.SpaceRepository;
import com.kh.app.product.stay.dto.request.StayExtraPriceReqDto;
import com.kh.app.product.stay.dto.request.StayInsertReqDto;
import com.kh.app.product.stay.dto.request.StayUpdateReqDto;
import com.kh.app.product.stay.dto.response.StayResDto;
import com.kh.app.product.stay.entity.*;
import com.kh.app.product.stay.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    private final S3Service s3Service;

    public List<StayResDto> selectAll() {
        return stayRepository.findAllByDelYn("N").stream()
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

        StayEntity stay = stayRepository.save(dto.toEntity(space));
        insertOptions(stay, dto.getOptionList());
        insertExtraPrices(stay, dto.getExtraPriceList());
        uploadAndSavePictures(stay, files);

        return stay.getId();
    }

    @Transactional
    public void update(Long id, StayUpdateReqDto dto) {
        StayEntity stay = findStay(id);
        stay.update(
                dto.getName(), dto.getSummary(), dto.getDescription(),
                dto.getCapacity(), dto.getMaxCapa(),
                dto.getCheckInTime(), dto.getCheckOutTime(),
                dto.getMonPrice(), dto.getTuePrice(), dto.getWedPrice(), dto.getThuPrice(),
                dto.getFriPrice(), dto.getSatPrice(), dto.getSunPrice(), dto.getHolidayPrice()
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

    private void insertExtraPrices(StayEntity stay, List<StayExtraPriceReqDto> extraPriceList) {
        if (extraPriceList == null || extraPriceList.isEmpty()) return;
        List<StayExtraPriceEntity> entities = extraPriceList.stream()
                .map(dto -> dto.toEntity(stay))
                .toList();
        stayExtraPriceRepository.saveAll(entities);
    }

    private void uploadAndSavePictures(StayEntity stay, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return;

        List<StayPictureEntity> entities = new ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            try {
                String s3key = s3Service.upload(file, "stay");
                String storedName = s3key.substring(s3key.lastIndexOf("/") + 1);
                entities.add(StayPictureEntity.builder()
                        .stay(stay)
                        .filePath(s3key)
                        .originName(file.getOriginalFilename())
                        .storedName(storedName)
                        .contentType(file.getContentType())
                        .fileSize(file.getSize())
                        .mainYn(i == 0 ? "Y" : "N")
                        .sortOrder(i)
                        .category(SpacePictureCategory.OTHERS)
                        .build());
            } catch (IOException e) {
                log.error("S3 upload failed for file: {}", file.getOriginalFilename(), e);
                throw new ProductException(ErrorCode.FILE_UPLOAD_FAILED);
            }
        }
        stayPictureRepository.saveAll(entities);
    }
}
