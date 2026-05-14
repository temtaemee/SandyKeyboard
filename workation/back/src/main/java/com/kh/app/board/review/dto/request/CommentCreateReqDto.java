package com.kh.app.board.review.dto.request;

import com.kh.app.board.review.entity.CommentEntity;
import com.kh.app.board.review.entity.ReviewEntity;
import com.kh.app.member.entity.MemberEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentCreateReqDto {

    private String content;
    private Integer rating;
    private String ownerYn;

    public CommentEntity toEntity(ReviewEntity review, MemberEntity member) {
        return CommentEntity.builder()
                .review(review)
                .member(member)
                .content(content)
                .rating(rating)
                .ownerYn(ownerYn != null ? ownerYn : "N")
                .build();
    }
}