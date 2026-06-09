package com.kh.app.member.dto.request;

import com.kh.app.product.space.entity.Area;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MemberUpdateReqDto {

    private String name;
    private String phone;
    private String email;
    private Area preferredArea;
    private String zonecode;
    private String address;
    private String addressDetail;



}