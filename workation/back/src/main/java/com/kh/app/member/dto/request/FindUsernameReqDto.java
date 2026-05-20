package com.kh.app.member.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FindUsernameReqDto {

    private String name;

    private String email;

}