
package com.kh.app.board.review.dto.request;

import com.kh.app.board.review.entity.ReviewEntity;
import com.kh.app.member.entity.MemberEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewCreateReqDto {

    private String title;
    private String content;
    private String tag;
    private Integer rating;

    public ReviewEntity toEntity(MemberEntity member) {
        return ReviewEntity.builder()
                .member(member)
                .title(title)
                .content(content)
                .tag(tag)
                .rating(rating)
                .build();
    }
}
