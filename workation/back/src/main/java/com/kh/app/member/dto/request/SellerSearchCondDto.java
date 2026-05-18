package com.kh.app.member.dto.request;

import com.kh.app.common.dto.PageReqDto;
import com.kh.app.member.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerSearchCondDto extends PageReqDto {

    private String keyword;
    private String sellerStatus;

}
