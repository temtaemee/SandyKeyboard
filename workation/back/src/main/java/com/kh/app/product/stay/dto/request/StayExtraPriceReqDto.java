package com.kh.app.product.stay.dto.request;

import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.entity.StayExtraPriceEntity;
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

    public StayExtraPriceEntity toEntity(StayEntity stay) {
        return StayExtraPriceEntity.builder()
                .stay(stay)
                .startDate(startDate)
                .endDate(endDate)
                .monPrice(monPrice != null ? monPrice : 0)
                .tuePrice(tuePrice != null ? tuePrice : 0)
                .wedPrice(wedPrice != null ? wedPrice : 0)
                .thuPrice(thuPrice != null ? thuPrice : 0)
                .friPrice(friPrice != null ? friPrice : 0)
                .satPrice(satPrice != null ? satPrice : 0)
                .sunPrice(sunPrice != null ? sunPrice : 0)
                .holidayPrice(holidayPrice != null ? holidayPrice : 0)
                .build();
    }
}