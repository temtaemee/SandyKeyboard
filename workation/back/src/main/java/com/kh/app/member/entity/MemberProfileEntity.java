package com.kh.app.member.entity;

import com.kh.app.company.entity.CompanyEntity;
import com.kh.app.product.space.entity.Area;
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

    @Enumerated(EnumType.STRING)
    private Area preferredArea;

    @Column(name = "NAME", length = 20)
    private String name;

    @Column(name = "PHONE", length = 13)
    private String phone;

    @Column(name = "EMAIL", length = 50)
    private String email;

    // MemberProfileEntity.java 예시
    @Column(name = "ZONECODE")
    private String zonecode; // 우편번호는 5자리라 기본값으로 충분합니다.

    @Column(name = "ADDRESS", length = 500) // 주소가 길어질 것을 대비해 넉넉하게 늘려줍니다.
    private String address;

    @Column(name = "ADDRESS_DETAIL", length = 500)
    private String addressDetail;

    public void updateProfile(
            String name,
            String phone,
            String email,
            Area preferredArea,
            String zonecode,
            String address,
            String addressDetail
    ) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.preferredArea = preferredArea;
        this.zonecode = zonecode;
        this.address = address;
        this.addressDetail = addressDetail;
    }

}