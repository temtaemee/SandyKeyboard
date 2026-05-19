package com.kh.app.member.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyEmailCodeReqDto {

    private String email;
    private String code;

}
