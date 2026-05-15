package com.kh.app.notification.entity;

import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ALARM")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private MemberEntity member;

    // Enum을 문자열로 데이터베이스에 저장 (ORDINAL보다 안전함)
    @Enumerated(EnumType.STRING)
    @Column(name = "TYPE_ID", nullable = false)
    private NotificationType type;

    @Column(name = "CONTENT", nullable = false)
    private String content;

    @Column(name = "READ_AT")
    private LocalDateTime readAt;

    @CreationTimestamp
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "REDIRECT_URL")
    private String redirectUrl;

    @Column(name = "REFERENCE_ID")
    private Long referenceId;

    // 알림 읽음 처리 메서드
    public void markAsRead() {
        this.readAt = LocalDateTime.now();
    }
}
