package com.kh.app.product.space.dto.response;

import com.kh.app.product.space.entity.Area;
import com.kh.app.product.space.entity.SpaceEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
@Schema(description = "공간 응답 DTO")
public class SpaceResDto {

    @Schema(description = "공간 ID")
    private Long id;

    @Schema(description = "공간명")
    private String name;

    @Schema(description = "연락처")
    private String phone;

    @Schema(description = "이메일")
    private String email;

    @Schema(description = "한줄 소개")
    private String summary;

    @Schema(description = "상세 설명")
    private String description;

    @Schema(description = "기본 주소")
    private String address1;

    @Schema(description = "상세 주소")
    private String address2;

    @Schema(description = "위도")
    private BigDecimal latitude;

    @Schema(description = "경도")
    private BigDecimal longitude;

    @Schema(description = "노출 여부")
    private String visibleYn;

    @Schema(description = "지역")
    private Area area;

    @Schema(description = "등록일")
    private LocalDateTime createdAt;

    @Schema(description = "수정일")
    private LocalDateTime updatedAt;

    public static SpaceResDto from(SpaceEntity entity) {
        return SpaceResDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .summary(entity.getSummary())
                .description(entity.getDescription())
                .address1(entity.getAddress1())
                .address2(entity.getAddress2())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .visibleYn(entity.getVisibleYn())
                .area(entity.getArea())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
