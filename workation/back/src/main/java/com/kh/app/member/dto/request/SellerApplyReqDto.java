package com.kh.app.member.dto.request;

import com.kh.app.member.entity.BankEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.SellerEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SellerApplyReqDto {

    private String businessNumber;   // 사업자등록번호

    private String companyName;      // 업체명

    private String bankName;         // 은행명 (또는 bankCode 추천)

    private String accountNumber;    // 계좌번호

    private String accountHolder;   // 예금주

    private Long bankId;

    public SellerEntity toSellerEntity(BankEntity bank, MemberEntity member){
        return SellerEntity.builder()
                .member(member)
                .bank(bank)
                .businessNo(businessNumber)
                .account(accountNumber)
                .accountName(accountHolder)
                .build();
    }
}