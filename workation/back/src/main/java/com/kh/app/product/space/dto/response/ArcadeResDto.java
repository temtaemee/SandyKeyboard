package com.kh.app.product.space.dto.response;

import com.kh.app.product.space.entity.ArcadeEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ArcadeResDto {
    private Long id;
    private String name;

    public static ArcadeResDto from(ArcadeEntity entity) {
        return ArcadeResDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }
}
