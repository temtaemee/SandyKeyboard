package com.kh.app.board.notice.dto.request;

import com.kh.app.board.notice.entity.NoticeEntity;
import com.kh.app.member.entity.MemberEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NoticeCreateReqDto {

    private Long memberId;
    private String title;
    private String content;
    private String pinYn = "N"; // 공지 고정 여부 (기본값: N)

    public NoticeEntity toEntity(MemberEntity member) {
        return NoticeEntity.builder()
                .member(member)
                .title(title)
                .content(content)
                .pinYn(pinYn != null ? pinYn : "N")
                .build();
    }
}