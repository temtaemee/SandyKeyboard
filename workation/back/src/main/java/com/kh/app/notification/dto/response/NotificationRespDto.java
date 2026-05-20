package com.kh.app.notification.dto.response;

import com.kh.app.notification.entity.NotificationEntity;
import com.kh.app.notification.entity.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRespDto {

    private Long id;

    private Long memberId;

    private NotificationType type;

    private String typeDescription;

    private String content;

    private boolean read;

    private LocalDateTime readAt;

    private LocalDateTime createdAt;

    private String redirectUrl;

    private Long referenceId;

    public static NotificationRespDto from(NotificationEntity entity) {

        return NotificationRespDto.builder()
                .id(entity.getId())
                .memberId(entity.getMember().getId())
                .type(entity.getType())
                .typeDescription(entity.getType().getDescription())
                .content(entity.getContent())
                .read(entity.getReadAt() != null)
                .readAt(entity.getReadAt())
                .createdAt(entity.getCreatedAt())
                .redirectUrl(entity.getRedirectUrl())
                .referenceId(entity.getReferenceId())
                .build();
    }
}