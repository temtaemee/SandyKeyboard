package com.kh.app.product.stay.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class StayExtraPriceReqDto {

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Integer monPrice;

    private Integer tuePrice;

    private Integer wedPrice;

    private Integer thuPrice;

    private Integer friPrice;

    private Integer satPrice;

    private Integer sunPrice;

    private Integer holidayPrice;

}