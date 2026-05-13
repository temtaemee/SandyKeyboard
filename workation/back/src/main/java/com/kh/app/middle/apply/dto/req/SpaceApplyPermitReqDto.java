package com.kh.app.middle.apply.dto.req;

import com.kh.app.middle.apply.entity.ApplyStatus;
import com.kh.app.middle.apply.entity.SpaceApplyEntity;
import lombok.Getter;

@Getter
public class SpaceApplyPermitReqDto {

    private Long id;
    private ApplyStatus applyStatus;

}
