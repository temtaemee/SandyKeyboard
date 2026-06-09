package com.kh.app.member.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerUpdateReqDto {

    // 1. 프로필/회사 관련 수정 정보
    private String companyName;

    // 2. 정산 은행 및 계좌 수정 정보
    private Long bankId;          // 어떤 은행인지 찾기 위한 FK ID
    private String account;       // 새로운 계좌번호
    private String accountName;   // 새로운 예금주명

    // 3. 사업자 정보 (보통 변경이 불가능하게 막지만, 수정이 필요한 비즈니스 로직이라면 포함)
    private String businessNo;
}