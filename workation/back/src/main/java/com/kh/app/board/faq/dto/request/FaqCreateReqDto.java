package com.kh.app.board.faq.dto.request;

import com.kh.app.board.faq.entity.FaqEntity;
import com.kh.app.member.entity.MemberEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FaqCreateReqDto {

    private Long memberId;
    private String question;
    private String answer;

    public FaqEntity toEntity(MemberEntity member) {
        return FaqEntity.builder()
                .member(member)
                .question(question)
                .answer(answer)
                .build();
    }
}