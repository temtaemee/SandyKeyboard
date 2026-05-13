package com.kh.app.product.stay.dto.request;

import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.stay.entity.StayEntity;
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

    public StayEntity toEntity(SpaceEntity space) {

        return StayEntity.builder()
                .space(space)
                .name(name)
                .summary(summary)
                .description(description)
                .capacity(capacity)
                .maxCapa(maxCapa)
                .checkInTime(checkInTime)
                .checkOutTime(checkOutTime)
                .monPrice(monPrice)
                .tuePrice(tuePrice)
                .wedPrice(wedPrice)
                .thuPrice(thuPrice)
                .friPrice(friPrice)
                .satPrice(satPrice)
                .sunPrice(sunPrice)
                .holidayPrice(holidayPrice)
                .visibleYn("Y")
                .build();
    }


}
