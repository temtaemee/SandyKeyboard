package com.kh.app.transaction.sales.dto.response;

import com.kh.app.product.space.entity.Area;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AreaSalesResDto {
    private String areaName;
    private Long totalNetSales;

    public static AreaSalesResDto from(Area area, Long totalNetSales) {
        return AreaSalesResDto.builder()
                .areaName(area.getDescription())
                .totalNetSales(totalNetSales != null ? totalNetSales : 0L)
                .build();
    }
}