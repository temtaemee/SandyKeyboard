package com.kh.app.product.stay.service;

import com.kh.app.product.common.util.S3PictureUploader;
import com.kh.app.product.exception.ErrorCode;
import com.kh.app.product.exception.ProductException;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.space.repository.SpaceRepository;
import com.kh.app.product.stay.dto.request.StayExtraPriceReqDto;
import com.kh.app.product.stay.dto.request.StayInsertReqDto;
import com.kh.app.product.stay.dto.request.StayPictureUpdateReqDto;
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
import java.util.Objects;

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

    // ========== 기존 메서드 (하위 호환) ==========

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

    // ========== Public 전용 메서드 ==========

    public List<StayResDto> searchListForPublic(StaySearchReqDto dto) {
        return stayRepository.searchListForPublic(dto).stream()
                .map(stay -> {
                    List<StayPictureEntity> pictures = stayPictureRepository.findByStayOrderBySortOrder(stay);
                    List<StayOption> options = stayOptionRepository.findByStay(stay).stream()
                            .map(StayOptionEntity::getStayOption).toList();
                    return StayResDto.from(stay, options, pictures);
                })
                .toList();
    }

    public StayResDto selectOneForPublic(Long id) {
        StayEntity stay = stayRepository.findByIdAndDelYnAndVisibleYn(id, "N", "Y")
                .orElseThrow(() -> new ProductException(ErrorCode.STAY_NOT_FOUND));
        if (stay.getSpace() == null
                || !"Y".equals(stay.getSpace().getVisibleYn())
                || "Y".equals(stay.getSpace().getDelYn())) {
            throw new ProductException(ErrorCode.STAY_NOT_FOUND);
        }
        List<StayPictureEntity> pictures = stayPictureRepository.findByStayOrderBySortOrder(stay);
        List<StayOption> options = stayOptionRepository.findByStay(stay).stream()
                .map(StayOptionEntity::getStayOption).toList();
        return StayResDto.from(stay, options, pictures);
    }

    // ========== Seller 전용 메서드 ==========

    @Transactional
    public Long insert(StayInsertReqDto dto, List<MultipartFile> files, Long memberId) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(dto.getSpaceId(), "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));

        verifySpaceOwnership(space, memberId);
        if (space.getApprovalStatus() != com.kh.app.product.space.entity.SpaceApprovalStatus.APPROVED) {
            throw new ProductException(ErrorCode.SPACE_NOT_APPROVED);
        }
        validateCheckInOutTime(dto.getCheckInTime(), dto.getCheckOutTime());

        StayEntity stay = stayRepository.save(dto.toEntity(space));
        insertOptions(stay, dto.getOptionList());
        insertExtraPrices(stay, stay.getId(), dto.getExtraPriceList());
        uploadAndSavePictures(stay, files);

        return stay.getId();
    }

    public List<StayResDto> searchMyStays(Long memberId) {
        return stayRepository.searchMyStays(memberId).stream()
                .map(stay -> {
                    List<StayResDto.PictureInfo> pictures = stayPictureRepository.findByStayOrderBySortOrder(stay)
                            .stream()
                            .map(p -> StayResDto.PictureInfo.builder()
                                    .id(p.getId())
                                    .filePath(resolveImageUrl(p.getFilePath()))
                                    .originName(p.getOriginName())
                                    .mainYn(p.getMainYn())
                                    .sortOrder(p.getSortOrder())
                                    .contentType(p.getContentType())
                                    .fileSize(p.getFileSize())
                                    .build())
                            .toList();
                    List<StayOption> options = stayOptionRepository.findByStay(stay).stream()
                            .map(StayOptionEntity::getStayOption).toList();
                    return StayResDto.from(stay, options, pictures, true);
                })
                .toList();
    }

    public StayResDto selectOneForSeller(Long id, Long memberId) {
        StayEntity stay = stayRepository.findById(id)
                .orElseThrow(() -> new ProductException(ErrorCode.STAY_NOT_FOUND));
        verifyStayOwnership(stay, memberId);

        List<StayResDto.PictureInfo> pictures = stayPictureRepository.findByStayOrderBySortOrder(stay)
                .stream()
                .map(p -> StayResDto.PictureInfo.builder()
                        .id(p.getId())
                        .filePath(resolveImageUrl(p.getFilePath()))
                        .originName(p.getOriginName())
                        .mainYn(p.getMainYn())
                        .sortOrder(p.getSortOrder())
                        .contentType(p.getContentType())
                        .fileSize(p.getFileSize())
                        .build())
                .toList();
        List<StayOption> options = stayOptionRepository.findByStay(stay).stream()
                .map(StayOptionEntity::getStayOption).toList();
        return StayResDto.from(stay, options, pictures, true);
    }

    @Transactional
    public void update(Long id, StayUpdateReqDto dto, Long memberId) {
        StayEntity stay = findStay(id);
        verifyStayOwnership(stay, memberId);

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
    public void changeVisibleYn(Long id, String visibleYn, Long memberId) {
        StayEntity stay = findStay(id);
        verifyStayOwnership(stay, memberId);
        stay.changeVisibleYn(visibleYn);
    }

    @Transactional
    public void delete(Long id, Long memberId) {
        StayEntity stay = findStay(id);
        verifyStayOwnership(stay, memberId);
        stay.delete();
    }

    // ========== Admin 전용 메서드 ==========

    @Transactional
    public Long insertByAdmin(StayInsertReqDto dto, List<MultipartFile> files) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(dto.getSpaceId(), "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));

        validateCheckInOutTime(dto.getCheckInTime(), dto.getCheckOutTime());

        StayEntity stay = stayRepository.save(dto.toEntity(space));
        insertOptions(stay, dto.getOptionList());
        insertExtraPrices(stay, stay.getId(), dto.getExtraPriceList());
        uploadAndSavePictures(stay, files);

        return stay.getId();
    }

    public List<StayResDto> searchListForAdmin(StaySearchReqDto dto) {
        return stayRepository.searchListForAdmin(dto).stream()
                .map(stay -> {
                    List<StayPictureEntity> pictures = stayPictureRepository.findByStayOrderBySortOrder(stay);
                    List<StayOption> options = stayOptionRepository.findByStay(stay).stream()
                            .map(StayOptionEntity::getStayOption).toList();
                    return StayResDto.from(stay, options, pictures);
                })
                .toList();
    }

    public StayResDto selectOneForAdmin(Long id) {
        StayEntity stay = stayRepository.findById(id)
                .orElseThrow(() -> new ProductException(ErrorCode.STAY_NOT_FOUND));
        List<StayPictureEntity> pictures = stayPictureRepository.findByStayOrderBySortOrder(stay);
        List<StayOption> options = stayOptionRepository.findByStay(stay).stream()
                .map(StayOptionEntity::getStayOption).toList();
        return StayResDto.from(stay, options, pictures);
    }

    @Transactional
    public void updateByAdmin(Long id, StayUpdateReqDto dto) {
        StayEntity stay = stayRepository.findById(id)
                .orElseThrow(() -> new ProductException(ErrorCode.STAY_NOT_FOUND));

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
    public void changeVisibleYnByAdmin(Long id, String visibleYn) {
        StayEntity stay = stayRepository.findById(id)
                .orElseThrow(() -> new ProductException(ErrorCode.STAY_NOT_FOUND));
        stay.changeVisibleYn(visibleYn);
    }

    @Transactional
    public void deleteByAdmin(Long id) {
        StayEntity stay = stayRepository.findById(id)
                .orElseThrow(() -> new ProductException(ErrorCode.STAY_NOT_FOUND));
        stay.delete();
    }

    // ========== 기존 호환 메서드 ==========

    @Transactional
    public Long insert(StayInsertReqDto dto, List<MultipartFile> files) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(dto.getSpaceId(), "N")
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

    // ========== Private 헬퍼 ==========

    @Transactional
    public void updatePictures(Long stayId, StayPictureUpdateReqDto dto,
                               List<MultipartFile> files, Long memberId) {
        StayEntity stay = findStay(stayId);
        verifyStayOwnership(stay, memberId);

        List<Long> keepIds = dto.getKeepPictureIds();
        if (keepIds == null || keepIds.isEmpty()) {
            stayPictureRepository.deleteByStayId(stayId);
        } else {
            stayPictureRepository.deleteByStayIdAndIdNotIn(stayId, keepIds);
            Long mainId = dto.getMainPictureId();
            for (int i = 0; i < keepIds.size(); i++) {
                String mainYn = keepIds.get(i).equals(mainId) ? "Y" : "N";
                stayPictureRepository.updateOrderAndMain(keepIds.get(i), i, mainYn);
            }
        }

        if (files != null && !files.isEmpty()) {
            List<String> s3Keys = s3PictureUploader.upload(files, "stay");
            int baseOrder = (keepIds == null || keepIds.isEmpty()) ? 0 : keepIds.size();
            List<StayPictureEntity> newPics = new ArrayList<>();
            for (int i = 0; i < files.size(); i++) {
                MultipartFile file = files.get(i);
                String s3Key = s3Keys.get(i);
                String storedName = s3Key.substring(s3Key.lastIndexOf("/") + 1);
                String mainYn = (dto.getNewPictures() != null && i < dto.getNewPictures().size())
                        ? dto.getNewPictures().get(i).getMainYn()
                        : (i == 0 ? "Y" : "N");
                newPics.add(StayPictureEntity.builder()
                        .stay(stay)
                        .filePath(s3Key)
                        .originName(file.getOriginalFilename())
                        .storedName(storedName)
                        .contentType(file.getContentType())
                        .fileSize(file.getSize())
                        .mainYn(mainYn)
                        .sortOrder(baseOrder + i)
                        .build());
            }
            stayPictureRepository.saveAll(newPics);
        }
    }

    private String resolveImageUrl(String filePath) {
        if (filePath == null) return null;
        if (filePath.startsWith("http")) return filePath;
        if (filePath.startsWith("/")) return "http://localhost" + filePath;
        return s3PictureUploader.getFileUrl(filePath);
    }

    private StayEntity findStay(Long id) {
        return stayRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.STAY_NOT_FOUND));
    }

    private void verifySpaceOwnership(SpaceEntity space, Long memberId) {
        if (space.getSeller() == null || !Objects.equals(space.getSeller().getId(), memberId)) {
            throw new ProductException(ErrorCode.SPACE_ACCESS_DENIED);
        }
    }

    private void verifyStayOwnership(StayEntity stay, Long memberId) {
        SpaceEntity space = stay.getSpace();
        if (space == null || space.getSeller() == null
                || !Objects.equals(space.getSeller().getId(), memberId)) {
            throw new ProductException(ErrorCode.STAY_ACCESS_DENIED);
        }
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

    /** checkIn/checkOut은 LocalTime만 저장 — 익일 퇴실이 일반적이므로 시간 순서 검증 없음 */
    private void validateCheckInOutTime(java.time.LocalTime checkInTime, java.time.LocalTime checkOutTime) {
        // 시간만으로 순서를 판단하면 안 됨 (예: 입실 15:00, 퇴실 익일 11:00)
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
