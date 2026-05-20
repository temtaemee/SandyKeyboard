package com.kh.app.board.review.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewUpdateReqDto {

    private String title;
    private String content;
    private String tag;
    private Integer rating;
}