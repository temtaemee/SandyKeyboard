package com.kh.app.product.office.dto.request;

import com.kh.app.product.office.entity.OfficeEntity;
import com.kh.app.product.office.entity.OfficeOption;
import com.kh.app.product.office.entity.OfficeType;
import com.kh.app.product.space.entity.SpaceEntity;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OfficeInsertReqDto {

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
    @Min(0)
    private Integer timePrice;

    @NotNull
    private OfficeType officeType;

    private List<OfficeOption> optionList;

    public OfficeEntity toEntity(SpaceEntity space) {
        return OfficeEntity.builder()
                .space(space)
                .name(name)
                .summary(summary)
                .description(description)
                .capacity(capacity)
                .maxCapa(maxCapa)
                .timePrice(timePrice)
                .officeType(officeType)
                .visibleYn("Y")
                .build();
    }
}
