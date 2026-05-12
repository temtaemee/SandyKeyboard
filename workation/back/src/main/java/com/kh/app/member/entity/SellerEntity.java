package com.kh.app.member.entity;

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
    private MemberEntity member; // 명명 규칙에 따라 MemberEntity로 참조

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BANK_ID", nullable = false)
    private BankEntity bank; // 방금 만드신 BankEntity를 참조

    @Column(name = "BUSINESS_NO", nullable = false, length = 13)
    private String businessNo;

    @Column(name = "ACCOUNT", nullable = false, length = 20)
    private String account;

    @Column(name = "ACCOUNT_NAME", nullable = false, length = 50)
    private String accountName;

    @CreationTimestamp
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public void updateSellerInfo(String companyName,BankEntity bank, String businessNo, String account, String accountName) {
        this.bank = bank;
        this.businessNo = businessNo;
        this.account = account;
        this.accountName = accountName;
    }
}