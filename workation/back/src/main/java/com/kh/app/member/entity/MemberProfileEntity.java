package com.kh.app.member.entity;

import com.kh.app.company.entity.CompanyEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "MEMBER_PROFILE")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class MemberProfileEntity {

    @Id
    @Column(name = "MEMBER_ID")
    private Long memberId;

    // MEMBER 와 PK 공유 (1:1)
    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private MemberEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COMPANY_ID")
    private CompanyEntity company;

    @Column(name = "NAME", length = 20)
    private String name;

    @Column(name = "PHONE", length = 13)
    private String phone;

    @Column(name = "EMAIL", length = 50)
    private String email;
}