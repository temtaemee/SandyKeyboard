package com.kh.app.member.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "SOCIAL_ACCOUNT")
@Getter
@Setter
public class SocialAccountEntity {

    @Id
    @Column(name = "SOCIAL_ID")
    private String socialId; // 고유 식별 번호

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private MemberEntity member;

    @Column(name = "PROVIDER", nullable = false, length = 50)
    private String provider;

    @Column(name = "CREATE_AT")
    private LocalDateTime createAt = LocalDateTime.now();
}