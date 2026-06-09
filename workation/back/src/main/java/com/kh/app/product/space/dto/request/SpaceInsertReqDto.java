package com.kh.app.product.space.dto.request;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.product.space.entity.Area;
import com.kh.app.product.space.entity.SpaceEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;


@Getter
@Setter
@Schema(description = "공간 등록 요청 DTO")
public class SpaceInsertReqDto {

    @Schema(description = "공간명", example = "제주 바다뷰 워케이션 스페이스")
    @NotBlank
    private String name;

    @Schema(description = "연락처 (숫자만, 최대 12자리)", example = "0647771234")
    @NotBlank
    private String phone;

    @Schema(description = "이메일", example = "space@example.com")
    @NotBlank
    @Email
    private String email;

    @Schema(description = "한줄 소개", example = "제주 바다가 보이는 프리미엄 워케이션 공간")
    @NotBlank
    private String summary;

    @Schema(description = "상세 설명")
    @NotBlank
    private String description;

    @Schema(description = "기본 주소", example = "제주특별자치도 제주시 연동")
    @NotBlank
    private String address1;

    @Schema(description = "상세 주소 (선택)", example = "123-45")
    private String address2;

    @Schema(description = "위도", example = "33.4996213")
    private BigDecimal latitude;

    @Schema(description = "경도", example = "126.5311884")
    private BigDecimal longitude;

    @Schema(description = "지역", example = "jeju")
    @NotNull
    private Area area;

    @Schema(description = "편의시설 ID 목록 (arcade 테이블에 존재하는 ID만 허용)", example = "[]")
    private List<Long> arcadeIdList;

    @Schema(description = "사진 메타데이터 목록 (files 배열과 인덱스 순서 일치 필수)")
    private List<PictureMetaReqDto> pictureList;

    public SpaceEntity toEntity(MemberEntity seller) {
        return SpaceEntity.builder()
                .name(name)
                .phone(phone)
                .email(email)
                .summary(summary)
                .description(description)
                .address1(address1)
                .address2(address2)
                .latitude(latitude)
                .longitude(longitude)
                .area(area)
                .visibleYn("N")
                .seller(seller)
                .build();
    }

}
