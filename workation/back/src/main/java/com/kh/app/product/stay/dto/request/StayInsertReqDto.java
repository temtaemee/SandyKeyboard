package com.kh.app.product.stay.dto.request;

import com.kh.app.product.stay.entity.StayOption;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class StayInsertReqDto {

    private Long spaceId;

    private String name;

    private String summary;

    private String description;

    private Integer capacity;

    private Integer maxCapa;

    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    private Integer monPrice;
    private Integer tuePrice;
    private Integer wedPrice;
    private Integer thuPrice;
    private Integer friPrice;
    private Integer satPrice;
    private Integer sunPrice;

    private Integer holidayPrice;

    private List<StayOption> optionList;

    private List<StayPictureReqDto> pictureList;

    private List<StayExtraPriceReqDto> extraPriceList;


}
