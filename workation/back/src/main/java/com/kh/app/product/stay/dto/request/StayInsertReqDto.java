package com.kh.app.product.stay.dto.request;

import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.entity.StayOption;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class StayInsertReqDto {

    @NotNull
    private Long spaceId;

    @NotBlank
    private String name;

    @NotBlank
    private String summary;

    @NotBlank
    private String description;

    @NotNull
    @Min(1)
    private Integer capacity;

    @NotNull
    @Min(1)
    private Integer maxCapa;

    @NotNull
    private LocalTime checkInTime;

    @NotNull
    private LocalTime checkOutTime;

    @NotNull @Min(0) private Integer monPrice;
    @NotNull @Min(0) private Integer tuePrice;
    @NotNull @Min(0) private Integer wedPrice;
    @NotNull @Min(0) private Integer thuPrice;
    @NotNull @Min(0) private Integer friPrice;
    @NotNull @Min(0) private Integer satPrice;
    @NotNull @Min(0) private Integer sunPrice;
    @NotNull @Min(0) private Integer holidayPrice;

    @NotBlank
    @Pattern(regexp = "^[YN]$")
    private String workationYn;

    private List<StayOption> optionList;

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
                .workationYn(workationYn)
                .visibleYn("Y")
                .build();
    }
}
