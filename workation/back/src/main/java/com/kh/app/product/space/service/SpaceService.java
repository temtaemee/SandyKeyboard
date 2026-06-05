package com.kh.app.product.space.service;

import com.kh.app.board.review.repository.ReviewRepository;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.notification.dto.request.NotificationCreateReqDto;
import com.kh.app.notification.entity.NotificationType;
import com.kh.app.notification.service.NotificationService;
import com.kh.app.product.common.util.S3PictureUploader;
import com.kh.app.product.exception.ErrorCode;
import com.kh.app.product.exception.ProductException;
import com.kh.app.product.space.dto.request.ArcadeInsertReqDto;
import com.kh.app.product.space.dto.request.PictureMetaReqDto;
import com.kh.app.product.space.dto.request.SpaceInsertReqDto;
import com.kh.app.product.space.dto.request.SpacePictureUpdateReqDto;
import com.kh.app.product.space.dto.request.SpaceSearchReqDto;
import com.kh.app.product.space.dto.request.SpaceUpdateReqDto;
import com.kh.app.product.space.dto.response.ArcadeResDto;
import com.kh.app.product.space.dto.response.SpaceResDto;
import com.kh.app.product.space.entity.*;
import com.kh.app.product.space.repository.ArcadeRepository;
import com.kh.app.product.space.repository.SpaceArcadeRepository;
import com.kh.app.product.space.repository.SpacePictureRepository;
import com.kh.app.product.space.repository.SpaceRepository;
import com.kh.app.product.stay.dto.response.StayResDto;
import com.kh.app.product.stay.entity.StayOption;
import com.kh.app.product.stay.entity.StayOptionEntity;
import com.kh.app.product.stay.repository.StayOptionRepository;
import com.kh.app.product.stay.repository.StayPictureRepository;
import com.kh.app.product.stay.repository.StayRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
public class SpaceService {

    private final SpaceRepository spaceRepository;
    private final ArcadeRepository arcadeRepository;
    private final SpaceArcadeRepository spaceArcadeRepository;
    private final SpacePictureRepository spacePictureRepository;
    private final S3PictureUploader s3PictureUploader;
    private final MemberRepository memberRepository;
    private final StayRepository stayRepository;
    private final StayOptionRepository stayOptionRepository;
    private final StayPictureRepository stayPictureRepository;
    private final NotificationService notificationService;
    private final ReviewRepository reviewRepository;

    // ========== 기존 메서드 (하위 호환) ==========

    public List<SpaceResDto> searchList(SpaceSearchReqDto dto) {
        return spaceRepository.searchList(dto)
                .stream()
                .map(space -> {
                    String thumbnailUrl = spacePictureRepository
                            .findBySpaceIdAndMainYn(space.getId(), "Y")
                            .map(p -> resolveImageUrl(p.getFilePath()))
                            .orElse(null);
                    return SpaceResDto.from(space, null, thumbnailUrl);
                })
                .toList();
    }

    public SpaceResDto selectOne(Long id) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));

        List<StayResDto> stays = stayRepository.findBySpaceIdAndDelYn(id, "N")
                .stream()
                .map(stay -> {
                    List<StayOption> options = stayOptionRepository.findByStay(stay)
                            .stream().map(StayOptionEntity::getStayOption).toList();
                    return StayResDto.from(stay, options, stayPictureRepository.findByStayOrderBySortOrder(stay));
                })
                .toList();

        return SpaceResDto.from(space, stays);
    }

    // ========== Public 전용 메서드 ==========

    public List<SpaceResDto> searchListForPublic(SpaceSearchReqDto dto) {
        return spaceRepository.searchListForPublic(dto)
                .stream()
                .map(space -> {
                    String thumbnailUrl = spacePictureRepository
                            .findBySpaceIdAndMainYn(space.getId(), "Y")
                            .map(p -> resolveImageUrl(p.getFilePath()))
                            .orElse(null);
                    return SpaceResDto.from(space, null, thumbnailUrl);
                })
                .toList();
    }

    public SpaceResDto selectOneForPublic(Long id) {
        SpaceEntity space = spaceRepository.findByIdAndDelYnAndVisibleYn(id, "N", "Y")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));

        List<StayResDto> stays = stayRepository.findBySpaceIdAndDelYn(id, "N")
                .stream()
                .map(stay -> {
                    List<StayOption> options = stayOptionRepository.findByStay(stay)
                            .stream().map(StayOptionEntity::getStayOption).toList();
                    return StayResDto.from(stay, options, stayPictureRepository.findByStayOrderBySortOrder(stay));
                })
                .toList();

        List<SpaceResDto.PictureInfo> pictures = spacePictureRepository.findBySpaceIdOrderBySortOrder(id)
                .stream()
                .map(p -> SpaceResDto.PictureInfo.builder()
                        .id(p.getId())
                        .filePath(resolveImageUrl(p.getFilePath()))
                        .mainYn(p.getMainYn())
                        .sortOrder(p.getSortOrder())
                        .category(p.getCategory())
                        .build())
                .toList();

        String thumbnailUrl = pictures.stream()
                .filter(p -> "Y".equals(p.getMainYn()))
                .findFirst()
                .map(SpaceResDto.PictureInfo::getFilePath)
                .orElse(pictures.isEmpty() ? null : pictures.get(0).getFilePath());

        List<Long> arcadeIdList = spaceArcadeRepository.findBySpaceId(id).stream()
                .map(sa -> sa.getArcade().getId())
                .toList();

        List<java.util.Map<String, Object>> arcades = spaceArcadeRepository.findBySpaceId(id).stream()
                .map(sa -> java.util.Map.<String, Object>of(
                        "id", sa.getArcade().getId(),
                        "name", sa.getArcade().getName()))
                .toList();

        return SpaceResDto.from(space, stays, thumbnailUrl, pictures, arcadeIdList, arcades);
    }

    // ========== Seller 전용 메서드 ==========

    @Transactional
    public Long insert(SpaceInsertReqDto dto, List<MultipartFile> files, Long memberId) {
        MemberEntity seller = memberRepository.findById(memberId)
                .orElseThrow(() -> new ProductException(ErrorCode.SELLER_NOT_FOUND));
        SpaceEntity space = spaceRepository.save(dto.toEntity(seller));
        uploadAndSavePictures(space, files, dto.getPictureList());
        insertArcades(space, dto.getArcadeIdList());
        return space.getId();
    }

    public List<ArcadeResDto> getAllArcades() {
        return arcadeRepository.findAll()
                .stream()
                .map(ArcadeResDto::from)
                .toList();
    }

    @Transactional
    public ArcadeResDto createArcade(ArcadeInsertReqDto dto) {
        ArcadeEntity arcade = arcadeRepository.save(
                ArcadeEntity.builder().name(dto.getName()).build()
        );
        return ArcadeResDto.from(arcade);
    }

    public List<SpaceResDto> searchListForSeller(Long memberId) {
        return spaceRepository.searchListForSeller(memberId)
                .stream()
                .map(space -> {
                    String thumbnailUrl = spacePictureRepository
                            .findBySpaceIdAndMainYn(space.getId(), "Y")
                            .map(p -> resolveImageUrl(p.getFilePath()))
                            .orElse(null);
                    return SpaceResDto.from(space, null, thumbnailUrl);
                })
                .toList();
    }

    public SpaceResDto selectOneForSeller(Long id, Long memberId) {
        SpaceEntity space = spaceRepository.findById(id)
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        verifySpaceOwnership(space, memberId);

        List<StayResDto> stays = stayRepository.findBySpaceIdAndDelYn(id, "N")
                .stream()
                .map(stay -> {
                    List<StayOption> options = stayOptionRepository.findByStay(stay)
                            .stream().map(StayOptionEntity::getStayOption).toList();
                    return StayResDto.from(stay, options, stayPictureRepository.findByStayOrderBySortOrder(stay));
                })
                .toList();

        List<SpaceResDto.PictureInfo> pictures = spacePictureRepository.findBySpaceIdOrderBySortOrder(id)
                .stream()
                .map(p -> SpaceResDto.PictureInfo.builder()
                        .id(p.getId())
                        .filePath(resolveImageUrl(p.getFilePath()))
                        .mainYn(p.getMainYn())
                        .sortOrder(p.getSortOrder())
                        .category(p.getCategory())
                        .build())
                .toList();

        String thumbnailUrl = pictures.stream()
                .filter(p -> "Y".equals(p.getMainYn()))
                .findFirst()
                .map(SpaceResDto.PictureInfo::getFilePath)
                .orElse(pictures.isEmpty() ? null : pictures.get(0).getFilePath());

        List<Long> arcadeIdList = spaceArcadeRepository.findBySpaceId(id).stream()
                .map(sa -> sa.getArcade().getId())
                .toList();

        List<java.util.Map<String, Object>> arcades = spaceArcadeRepository.findBySpaceId(id).stream()
                .map(sa -> java.util.Map.<String, Object>of(
                        "id", sa.getArcade().getId(),
                        "name", sa.getArcade().getName()))
                .toList();

        return SpaceResDto.from(space, stays, thumbnailUrl, pictures, arcadeIdList, arcades);
    }

    @Transactional
    public void updatePictures(Long spaceId, SpacePictureUpdateReqDto dto,
                                List<MultipartFile> files, Long memberId) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(spaceId, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        verifySpaceOwnership(space, memberId);

        List<Long> keepIds = dto.getKeepPictureIds();
        if (keepIds == null || keepIds.isEmpty()) {
            spacePictureRepository.deleteBySpaceId(spaceId);
        } else {
            spacePictureRepository.deleteBySpaceIdAndIdNotIn(spaceId, keepIds);
            // keepPictureIds 순서 = 새 sortOrder, mainPictureId = 대표
            Long mainId = dto.getMainPictureId();
            for (int i = 0; i < keepIds.size(); i++) {
                String mainYn = keepIds.get(i).equals(mainId) ? "Y" : "N";
                spacePictureRepository.updateOrderAndMain(keepIds.get(i), i, mainYn);
            }
        }

        if (dto.getCategoryUpdates() != null) {
            for (SpacePictureUpdateReqDto.CategoryUpdateDto cu : dto.getCategoryUpdates()) {
                spacePictureRepository.updateCategory(cu.getId(), cu.getCategory());
            }
        }

        uploadAndSavePictures(space, files, dto.getNewPictures());
    }

    @Transactional
    public void update(Long id, SpaceUpdateReqDto dto, Long memberId) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        verifySpaceOwnership(space, memberId);
        space.update(
                dto.getName(), dto.getPhone(), dto.getEmail(),
                dto.getSummary(), dto.getDescription(),
                dto.getAddress1(), dto.getAddress2(),
                dto.getLatitude(), dto.getLongitude(), dto.getArea()
        );
        if (dto.getArcadeIdList() != null) {
            spaceArcadeRepository.deleteBySpaceId(id);
            insertArcades(space, dto.getArcadeIdList());
        }
    }

    @Transactional
    public void requestApproval(Long id, Long memberId) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        verifySpaceOwnership(space, memberId);
        space.requestApproval();

        // 슈퍼 관리자에게 알림
        memberRepository.findByUsername("admin").ifPresent(admin ->
            notificationService.createNotification(NotificationCreateReqDto.builder()
                .memberId(admin.getId())
                .type(NotificationType.SPACE_PENDING)
                .content("새 공간 승인 요청: " + space.getName())
                .redirectUrl("/admin/spaces/" + id)
                .referenceId(id)
                .build())
        );
    }

    @Transactional
    public void delete(Long id, Long memberId) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        verifySpaceOwnership(space, memberId);
        space.delete();
    }

    @Transactional
    public void changeVisibleYn(Long id, String visibleYn, Long memberId) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        verifySpaceOwnership(space, memberId);
        if ("Y".equals(visibleYn)) {
            if (space.getApprovalStatus() != com.kh.app.product.space.entity.SpaceApprovalStatus.APPROVED) {
                throw new ProductException(ErrorCode.SPACE_NOT_APPROVED);
            }
            if (Boolean.TRUE.equals(space.getAdminHidden())) {
                throw new ProductException(ErrorCode.SPACE_ACCESS_DENIED);
            }
        }
        space.changeVisibleYn(visibleYn);
    }

    // ========== Admin 전용 메서드 ==========

    @Transactional
    public void approveByAdmin(Long id) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        space.approve();

        Long sellerMemberId = space.getSeller().getId();
        notificationService.createNotification(NotificationCreateReqDto.builder()
                .memberId(sellerMemberId)
                .type(NotificationType.SPACE_APPROVED)
                .content("공간이 승인되었습니다: " + space.getName())
                .redirectUrl("/seller/spaces/" + id)
                .referenceId(id)
                .build());
    }

    @Transactional
    public void rejectByAdmin(Long id, String reason) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        space.reject(reason);

        Long sellerMemberId = space.getSeller().getId();
        notificationService.createNotification(NotificationCreateReqDto.builder()
                .memberId(sellerMemberId)
                .type(NotificationType.SPACE_REJECTED)
                .content("공간이 반려되었습니다: " + space.getName())
                .redirectUrl("/seller/spaces/" + id + "/edit")
                .referenceId(id)
                .build());
    }

    public List<SpaceResDto> searchListForAdmin(SpaceSearchReqDto dto) {
        return spaceRepository.searchListForAdmin(dto)
                .stream()
                .map(space -> {
                    String thumbnailUrl = spacePictureRepository
                            .findBySpaceIdAndMainYn(space.getId(), "Y")
                            .map(p -> resolveImageUrl(p.getFilePath()))
                            .orElse(null);
                    return SpaceResDto.from(space, null, thumbnailUrl);
                })
                .toList();
    }

    public SpaceResDto selectOneForAdmin(Long id) {
        SpaceEntity space = spaceRepository.findById(id)
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));

        List<StayResDto> stays = stayRepository.findBySpaceIdAndDelYn(id, "N")
                .stream()
                .map(stay -> {
                    List<StayOption> options = stayOptionRepository.findByStay(stay)
                            .stream().map(StayOptionEntity::getStayOption).toList();
                    return StayResDto.from(stay, options, stayPictureRepository.findByStayOrderBySortOrder(stay));
                })
                .toList();

        return SpaceResDto.from(space, stays);
    }

    @Transactional
    public void updateByAdmin(Long id, SpaceUpdateReqDto dto) {
        SpaceEntity space = spaceRepository.findById(id)
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        space.update(
                dto.getName(), dto.getPhone(), dto.getEmail(),
                dto.getSummary(), dto.getDescription(),
                dto.getAddress1(), dto.getAddress2(),
                dto.getLatitude(), dto.getLongitude(), dto.getArea()
        );
    }

    @Transactional
    public void deleteByAdmin(Long id) {
        SpaceEntity space = spaceRepository.findById(id)
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        space.delete();
    }

    @Transactional
    public void changeVisibleYnByAdmin(Long id, String visibleYn, Long adminMemberId) {
        SpaceEntity space = spaceRepository.findById(id)
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));

        boolean hiding = "N".equals(visibleYn);
        if (hiding) space.hideByAdmin(); else space.showByAdmin();

        Long sellerId = space.getSeller() != null ? space.getSeller().getId() : null;
        String spaceName = space.getName();

        if (hiding) {
            // 셀러 알림
            if (sellerId != null) {
                notificationService.createNotification(NotificationCreateReqDto.builder()
                        .memberId(sellerId)
                        .type(NotificationType.SPACE_HIDDEN_BY_ADMIN)
                        .content("관리자가 공간을 비노출 처리했습니다: " + spaceName)
                        .redirectUrl("/seller/spaces/" + id)
                        .referenceId(id)
                        .build());
            }
            // 관리자 확인 알림
            notificationService.createNotification(NotificationCreateReqDto.builder()
                    .memberId(adminMemberId)
                    .type(NotificationType.SPACE_HIDDEN_BY_ADMIN)
                    .content("[처리 완료] 비노출 처리: " + spaceName)
                    .redirectUrl("/admin/spaces/" + id)
                    .referenceId(id)
                    .build());
        } else {
            // 셀러 알림
            if (sellerId != null) {
                notificationService.createNotification(NotificationCreateReqDto.builder()
                        .memberId(sellerId)
                        .type(NotificationType.SPACE_VISIBLE_BY_ADMIN)
                        .content("관리자가 공간을 다시 노출 처리했습니다: " + spaceName)
                        .redirectUrl("/seller/spaces/" + id)
                        .referenceId(id)
                        .build());
            }
            // 관리자 확인 알림
            notificationService.createNotification(NotificationCreateReqDto.builder()
                    .memberId(adminMemberId)
                    .type(NotificationType.SPACE_VISIBLE_BY_ADMIN)
                    .content("[처리 완료] 노출 복구: " + spaceName)
                    .redirectUrl("/admin/spaces/" + id)
                    .referenceId(id)
                    .build());
        }
    }

    // ========== 기존 호환 메서드 (sellerId DTO 기반 — 내부 사용 가능성 유지) ==========

    @Transactional
    public Long insert(SpaceInsertReqDto dto, List<MultipartFile> files) {
        MemberEntity seller = memberRepository.findById(1L)
                .orElseThrow(() -> new ProductException(ErrorCode.SELLER_NOT_FOUND));
        SpaceEntity space = spaceRepository.save(dto.toEntity(seller));
        uploadAndSavePictures(space, files, dto.getPictureList());
        insertArcades(space, dto.getArcadeIdList());
        return space.getId();
    }

    @Transactional
    public void update(Long id, SpaceUpdateReqDto dto) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        space.update(
                dto.getName(), dto.getPhone(), dto.getEmail(),
                dto.getSummary(), dto.getDescription(),
                dto.getAddress1(), dto.getAddress2(),
                dto.getLatitude(), dto.getLongitude(), dto.getArea()
        );
    }

    @Transactional
    public void changeVisibleYn(Long id, String visibleYn) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        space.changeVisibleYn(visibleYn);
    }

    @Transactional
    public void delete(Long id) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        space.delete();
    }

    // ========== Private 헬퍼 ==========

    private String resolveImageUrl(String filePath) {
        if (filePath == null) return null;
        if (filePath.startsWith("http")) return filePath;
        if (filePath.startsWith("/")) return "http://localhost" + filePath;
        return s3PictureUploader.getFileUrl(filePath);
    }

    private void verifySpaceOwnership(SpaceEntity space, Long memberId) {
        if (space.getSeller() == null || !Objects.equals(space.getSeller().getId(), memberId)) {
            throw new ProductException(ErrorCode.SPACE_ACCESS_DENIED);
        }
    }

    private void uploadAndSavePictures(SpaceEntity space, List<MultipartFile> files, List<PictureMetaReqDto> pictureMeta) {
        if (files == null || files.isEmpty()) return;

        List<String> s3Keys = s3PictureUploader.upload(files, "space");

        List<SpacePictureEntity> entities = new ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String s3Key = s3Keys.get(i);
            String storedName = s3Key.substring(s3Key.lastIndexOf("/") + 1);

            String mainYn = (i == 0) ? "Y" : "N";
            int sortOrder = i;
            SpacePictureCategory category = SpacePictureCategory.OTHERS;

            if (pictureMeta != null && i < pictureMeta.size()) {
                PictureMetaReqDto meta = pictureMeta.get(i);
                if (meta.getMainYn() != null) mainYn = meta.getMainYn();
                if (meta.getSortOrder() != null) sortOrder = meta.getSortOrder();
                if (meta.getCategory() != null) category = meta.getCategory();
            }

            entities.add(SpacePictureEntity.builder()
                    .space(space)
                    .filePath(s3Key)
                    .originName(file.getOriginalFilename())
                    .storedName(storedName)
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .mainYn(mainYn)
                    .sortOrder(sortOrder)
                    .category(category)
                    .build());
        }
        spacePictureRepository.saveAll(entities);
    }

    private void insertArcades(SpaceEntity space, List<Long> arcadeIdList) {
        if (arcadeIdList == null || arcadeIdList.isEmpty()) {
            return;
        }

        List<SpaceArcadeEntity> entityList =
                arcadeIdList.stream()
                        .map(id ->
                                SpaceArcadeEntity.builder()
                                        .space(space)
                                        .arcade(
                                                ArcadeEntity.builder()
                                                        .id(id)
                                                        .build()
                                        )
                                        .build()
                        )
                        .toList();

        spaceArcadeRepository.saveAll(entityList);
    }

    public List<SpaceResDto> getRecommendedSpaces(Area area) {
        List<SpaceEntity> spaces = spaceRepository.findRecommendedSpaces(area);

        return spaces.stream().map(space -> {
            // 1. 리스트로 결과를 받습니다.
            List<Double> result = reviewRepository.findAverageRatingBySpaceId(space.getId());

            // 2. 리스트가 비어있지 않으면 첫 번째 값을 가져오고, 없으면 0.0을 사용합니다.
            Double avgRating = (result != null && !result.isEmpty()) ? result.get(0) : 0.0;

            // 3. 썸네일 URL 가져오기
            String thumbnailUrl = spacePictureRepository
                    .findBySpaceIdAndMainYn(space.getId(), "Y")
                    .map(p -> resolveImageUrl(p.getFilePath()))
                    .orElse(null);

            // 4. DTO 생성 (아까 만든 5개짜리 from 메서드 호출)
            return SpaceResDto.from(space, null, thumbnailUrl, null, avgRating);
        }).collect(Collectors.toList());
    }
}
