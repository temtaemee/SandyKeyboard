package com.kh.app.middle.apply.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.product.space.entity.SpaceEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "SPACE_APPLY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class SpaceApplyEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SPACE_ID")
    private SpaceEntity space;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private MemberEntity seller;

    @Column(length = 20, nullable = false)
    @Builder.Default
    private ApplyStatus applyStatus = ApplyStatus.P;

    private LocalDateTime reviewedAt;

    //거절
    public void reject() {
        this.applyStatus = ApplyStatus.R;
        this.reviewedAt = LocalDateTime.now();
    }

    //승인
    public void approve() {
        this.applyStatus = ApplyStatus.A;
        this.reviewedAt = LocalDateTime.now();
    }

}
