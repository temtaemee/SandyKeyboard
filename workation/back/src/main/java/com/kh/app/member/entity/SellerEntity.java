package com.kh.app.member.entity;

import com.kh.app.member.dto.request.SellerUpdateReqDto;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "SELLER")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class SellerEntity {

    @Id
    @Column(name = "MEMBER_ID")
    private Long memberId; // MEMBER_ID를 PK로 사용

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private MemberEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BANK_ID", nullable = false)
    private BankEntity bank;

    // ✨ 업체명 컬럼 추가 (크기는 상호명이 길어질 수 있으므로 100 정도로 넉넉하게 잡았습니다)
    @Column(name = "COMPANY_NAME", nullable = false, length = 100)
    private String companyName;

    @Column(name = "BUSINESS_NO", nullable = false, length = 13)
    private String businessNo;

    @Column(name = "ACCOUNT", nullable = false, length = 20)
    private String account;

    @Column(name = "ACCOUNT_NAME", nullable = false, length = 50)
    private String accountName;

    @CreationTimestamp
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ✨ 수정 메서드 내부에서 companyName을 실제로 세팅하도록 보완!
    // SellerEntity.java 내부 수정

    public void updateSeller(SellerUpdateReqDto dto, BankEntity bank) {
        // 1. 방어 코드 (필요시 값 검증 로직을 엔티티 내부에 응집 가능)
        if (dto.getAccount() != null && dto.getAccount().contains("-")) {
            // 예시: 계좌번호 하이픈 제거 같은 도메인 특화 로직 처리 가능
        }

        // 2. 데이터 상태 변경
        this.companyName = dto.getCompanyName();
        this.bank = bank;
        this.businessNo = dto.getBusinessNo();
        this.account = dto.getAccount();
        this.accountName = dto.getAccountName();
    }
}