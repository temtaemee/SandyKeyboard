package com.kh.app.product.space.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "SPACE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class SpaceEntity extends BaseEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100 , nullable = false , unique = true)
    private String name;

    @Column(length = 12 , nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String summary;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String address1;

    @Column(nullable = true, length = 100)
    private String address2;

    // 위도: -90.0 ~ 90.0 (정수부 최대 2자리 + 소수점 7자리 = 9자리면 충분하지만 보통 10으로 맞춤)
    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    // 경도: -180.0 ~ 180.0 (정수부 최대 3자리 + 소수점 7자리 = 10자리)
    @Column(precision = 11, scale = 7)
    private BigDecimal longitude;

    @Column(nullable = false, length = 1)
    @Builder.Default
    private String visibleYn = "N"; //기본 visible = n -> 상품 심사 통과시 Y로 수정해서 해당 space에 대한 권한을 열어줌

    @Enumerated(EnumType.STRING)
    @Column(name = "area", nullable = false)
    private Area area;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private MemberEntity seller;

    public void changeVisibleYn(String visibleYn) {
        this.visibleYn = visibleYn;
    }

    public void update(String name, String phone, String email, String summary, String description,
                       String address1, String address2, BigDecimal latitude, BigDecimal longitude, Area area) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.summary = summary;
        this.description = description;
        this.address1 = address1;
        this.address2 = address2;
        this.latitude = latitude;
        this.longitude = longitude;
        this.area = area;
    }



}
