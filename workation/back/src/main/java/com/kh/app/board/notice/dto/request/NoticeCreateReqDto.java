package com.kh.app.board.notice.dto.request;

import com.kh.app.board.notice.entity.NoticeEntity;
import com.kh.app.member.entity.MemberEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeCreateReqDto {

    private Long memberId;
    private String title;
    private String content;

    public NoticeEntity toEntity(MemberEntity member) {
        return NoticeEntity.builder()
                .member(member)
                .title(title)
                .content(content)
                .build();
    }
}
