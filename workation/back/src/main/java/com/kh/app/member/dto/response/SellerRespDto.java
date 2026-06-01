package com.kh.app.member.dto.response;

import com.kh.app.member.entity.SellerEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.MemberProfileEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SellerRespDto {
    private Long memberId;

    // Member 계정 정보
    private String username;

    // MemberProfileEntity (프로필 테이블)에서 가져올 정보
    private String name;
    private String email;
    private String phone;

    // Seller 전용 정보
    private String businessNo;
    private Long bankId;
    private String bankName;
    private String account;
    private String accountName;
    private LocalDateTime createdAt;

    public static SellerRespDto from(SellerEntity seller) {
        MemberEntity member = seller.getMember();
        MemberProfileEntity profile = (member != null) ? member.getProfile() : null;

        return SellerRespDto.builder()
                .memberId(seller.getMemberId())
                .username(member != null ? member.getUsername() : null)
                .name(profile != null ? profile.getName() : null)
                .email(profile != null ? profile.getEmail() : null)
                .phone(profile != null ? profile.getPhone() : null)
                .businessNo(seller.getBusinessNo())
                .bankId(seller.getBank() != null ? seller.getBank().getBankId() : null)
                .bankName(seller.getBank() != null ? seller.getBank().getBankName() : null)
                .account(seller.getAccount())
                .accountName(seller.getAccountName())
                .createdAt(seller.getCreatedAt())
                .build();
    }
}