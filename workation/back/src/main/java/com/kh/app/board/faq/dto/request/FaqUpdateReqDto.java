package com.kh.app.board.faq.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FaqUpdateReqDto {

    private String question;
    private String answer;
}
