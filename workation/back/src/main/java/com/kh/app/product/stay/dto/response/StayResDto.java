package com.kh.app.product.stay.dto.response;

import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.entity.StayOption;
import com.kh.app.product.stay.entity.StayPictureEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Builder
public class StayResDto {

    private Long id;
    private Long spaceId;
    private String name;
    private String summary;
    private String description;
    private int capacity;
    private int maxCapa;
    private String visibleYn;
    private String workationYn;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private int monPrice;
    private int tuePrice;
    private int wedPrice;
    private int thuPrice;
    private int friPrice;
    private int satPrice;
    private int sunPrice;
    private int holidayPrice;
    private List<StayOption> options;
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

    public static StayResDto from(StayEntity entity, List<StayOption> options, List<StayPictureEntity> pictures) {
        return StayResDto.builder()
                .id(entity.getId())
                .spaceId(entity.getSpace().getId())
                .name(entity.getName())
                .summary(entity.getSummary())
                .description(entity.getDescription())
                .capacity(entity.getCapacity())
                .maxCapa(entity.getMaxCapa())
                .visibleYn(entity.getVisibleYn())
                .workationYn(entity.getWorkationYn())
                .checkInTime(entity.getCheckInTime())
                .checkOutTime(entity.getCheckOutTime())
                .monPrice(entity.getMonPrice())
                .tuePrice(entity.getTuePrice())
                .wedPrice(entity.getWedPrice())
                .thuPrice(entity.getThuPrice())
                .friPrice(entity.getFriPrice())
                .satPrice(entity.getSatPrice())
                .sunPrice(entity.getSunPrice())
                .holidayPrice(entity.getHolidayPrice())
                .options(options)
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
