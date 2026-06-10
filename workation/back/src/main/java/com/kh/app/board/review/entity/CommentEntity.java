package com.kh.app.board.review.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "REVIEW_COMMENT")
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class CommentEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "REVIEW_ID", nullable = false)
    private ReviewEntity review;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private MemberEntity member;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column
    private Integer rating;

    // 제휴점 답변 여부
    @Column(length = 1, nullable = false)
    @Builder.Default
    private String ownerYn = "N";

    // 관리자 댓글 숨김 여부 (Y: 숨김, N: 표시)
    @Column(length = 1, nullable = false)
    @Builder.Default
    private String hideYn = "N";

    // 댓글 숨김 처리
    public void hide() {
        this.hideYn = "Y";
    }

    // 댓글 숨김 해제
    public void show() {
        this.hideYn = "N";
    }
}