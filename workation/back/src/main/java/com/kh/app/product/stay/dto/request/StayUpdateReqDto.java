package com.kh.app.product.stay.dto.request;

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
public class StayUpdateReqDto {

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
}
