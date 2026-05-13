package com.kh.app.product.office.dto.request;

import com.kh.app.product.office.entity.OfficeEntity;
import com.kh.app.product.office.entity.OfficeType;
import com.kh.app.product.space.entity.SpaceEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class OfficeInsertReqDto {

    private Long spaceId;

    private String name;

    private String summary;

    private String description;

    private Integer capacity;

    private Integer maxCapa;

    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    private Integer timePrice;

    private OfficeType officeType;

    private List<OfficePictureReqDto> pictureList;

    public OfficeEntity toEntity(SpaceEntity space) {

        return OfficeEntity.builder()
                .space(space)
                .name(name)
                .summary(summary)
                .description(description)
                .capacity(capacity)
                .maxCapa(maxCapa)
                .checkInTime(checkInTime)
                .checkOutTime(checkOutTime)
                .timePrice(timePrice)
                .officeType(officeType)
                .visibleYn("Y")
                .build();
    }
}
