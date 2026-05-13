package com.kh.app.member.dto.response;

import com.kh.app.member.entity.BankEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BankRespDto {
    private Long bankId;
    private String bankName;

    // Entity -> DTO 변환 정적 메서드
    public static BankRespDto from(BankEntity entity) {
        return new BankRespDto(entity.getBankId(), entity.getBankName());
    }
}