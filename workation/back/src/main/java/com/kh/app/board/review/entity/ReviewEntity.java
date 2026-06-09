package com.kh.app.board.review.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "REVIEW")
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ReviewEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private MemberEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private ReservationEntity reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id", nullable = false)
    private SpaceEntity space;

    @Column(length = 200, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(length = 200)
    private String tag;

    @Column(nullable = false)
    private Integer rating;

    // 관리자 리뷰 숨김 여부 (Y: 숨김, N: 표시)
    @Column(length = 1, nullable = false)
    @Builder.Default
    private String hideYn = "N";

    public void update(String title, String content, String tag, Integer rating) {
        this.title   = title;
        this.content = content;
        this.tag     = tag;
        this.rating  = rating;
    }

    // 리뷰 숨김 처리
    public void hide() {
        this.hideYn = "Y";
    }

    // 리뷰 숨김 해제
    public void show() {
        this.hideYn = "N";
    }
}