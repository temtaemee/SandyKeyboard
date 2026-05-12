package com.kh.app.product.office.dto.request;

import com.kh.app.product.office.entity.OfficeType;
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
}
