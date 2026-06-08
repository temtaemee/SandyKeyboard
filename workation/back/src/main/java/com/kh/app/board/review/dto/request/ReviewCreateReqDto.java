package com.kh.app.board.review.dto.request;

import com.kh.app.board.review.entity.ReviewEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewCreateReqDto {

    private Long reservationId; // 예약 ID 추가
    private String title;
    private String content;
    private String tag;
    private Integer rating;

    public ReviewEntity toEntity(MemberEntity member, ReservationEntity reservation) {
        return ReviewEntity.builder()
                .member(member)
                .reservation(reservation)
                .title(title)
                .content(content)
                .tag(tag)
                .rating(rating)
                .build();
    }
}