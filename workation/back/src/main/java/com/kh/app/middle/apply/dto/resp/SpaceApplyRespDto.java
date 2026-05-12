package com.kh.app.middle.apply.dto.resp;

import com.kh.app.middle.apply.entity.SpaceApplyEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class SpaceApplyRespDto {

    private Long id;
    private String sellerName;
    private String spaceName;
    private String applyStatus;
    private LocalDateTime reviewedAt;
    private String createAt;

    public static SpaceApplyRespDto from(SpaceApplyEntity entity) {
        return SpaceApplyRespDto.builder()
                .id(entity.getId())
                .sellerName(entity.getSeller().getProfile().getName())
                .spaceName(entity.getSpace().getName())
                .applyStatus(entity.getApplyStatus())
                .reviewedAt(entity.getReviewedAt())
                .createAt(entity.getCreatedAt().toString())
                .build();
    }

}
