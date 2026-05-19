package com.kh.app.member.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordReqDto {

    private String email;
    private String newPassword;
    private String newPasswordCheck;
}
