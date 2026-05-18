package com.kh.app.product.office.dto.response;

import com.kh.app.product.office.entity.OfficeEntity;
import com.kh.app.product.office.entity.OfficeOption;
import com.kh.app.product.office.entity.OfficePictureEntity;
import com.kh.app.product.office.entity.OfficeOptionEntity;
import com.kh.app.product.office.entity.OfficeType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class OfficeResDto {

    private Long id;
    private Long spaceId;
    private String name;
    private String summary;
    private String description;
    private int capacity;
    private int maxCapa;
    private String visibleYn;
    private int timePrice;
    private OfficeType officeType;
    private List<OfficeOption> options;
    private List<PictureInfo> pictures;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Builder
    public static class PictureInfo {
        private Long id;
        private String filePath;
        private String originName;
        private String mainYn;
        private Integer sortOrder;
        private String contentType;
        private Long fileSize;
    }

    public static OfficeResDto from(OfficeEntity entity, List<OfficeOptionEntity> options, List<OfficePictureEntity> pictures) {
        return OfficeResDto.builder()
                .id(entity.getId())
                .spaceId(entity.getSpace().getId())
                .name(entity.getName())
                .summary(entity.getSummary())
                .description(entity.getDescription())
                .capacity(entity.getCapacity())
                .maxCapa(entity.getMaxCapa())
                .visibleYn(entity.getVisibleYn())
                .timePrice(entity.getTimePrice())
                .officeType(entity.getOfficeType())
                .options(options.stream().map(OfficeOptionEntity::getOfficeOption).toList())
                .pictures(pictures.stream()
                        .map(p -> PictureInfo.builder()
                                .id(p.getId())
                                .filePath(p.getFilePath())
                                .originName(p.getOriginName())
                                .mainYn(p.getMainYn())
                                .sortOrder(p.getSortOrder())
                                .contentType(p.getContentType())
                                .fileSize(p.getFileSize())
                                .build())
                        .toList())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
