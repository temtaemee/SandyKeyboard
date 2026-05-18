package com.kh.app.middle.apply.dto.req;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.middle.apply.entity.SpaceApplyEntity;
import com.kh.app.product.space.entity.SpaceEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
public class SpaceApplyReqDto {

    private Long spaceId; // 어떤공간?

    public SpaceApplyEntity toEntity(MemberEntity seller, SpaceEntity space) {
        return SpaceApplyEntity.builder()
                .seller(seller)
                .space(space)
                .build();
    }
}
