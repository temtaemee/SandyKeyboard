package com.kh.app.notification.dto.request;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.notification.entity.NotificationEntity;
import com.kh.app.notification.entity.NotificationType;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationCreateReqDto {

    private Long memberId;

    private NotificationType type;

    private String content;

    private String redirectUrl;

    private Long referenceId;
}