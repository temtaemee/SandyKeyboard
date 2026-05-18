package com.kh.app.member.dto.request;

import com.kh.app.common.dto.PageReqDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberSearchCondDto extends PageReqDto {

    private String keyword;
    private String status;
}
