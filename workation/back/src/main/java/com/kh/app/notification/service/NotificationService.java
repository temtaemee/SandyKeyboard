package com.kh.app.notification.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.notification.dto.request.NotificationCreateReqDto;
import com.kh.app.notification.dto.request.NotificationReadReqDto;
import com.kh.app.notification.dto.response.NotificationRespDto;
import com.kh.app.notification.entity.NotificationEntity;
import com.kh.app.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void createNotification(NotificationCreateReqDto createReqDto){
        MemberEntity member = memberRepository.findById(createReqDto.getMemberId())
                .orElseThrow(()->new RuntimeException("회원 없음"));

        NotificationEntity notification = NotificationEntity.builder()
                .member(member)
                .type(createReqDto.getType())
                .content(createReqDto.getContent())
                .redirectUrl(createReqDto.getRedirectUrl())
                .referenceId(createReqDto.getReferenceId())
                .build();
        notificationRepository.save(notification);
    }

    public List<NotificationRespDto> getNotificationList(Long memberId) {
        return notificationRepository
                .findByMemberIdOrderByCreatedAtDesc(memberId)
                .stream()
                .map(NotificationRespDto::from)
                .toList();
    }

    @Transactional
    public void isRead(NotificationReadReqDto dto) {
        NotificationEntity notification = notificationRepository.findById(dto.getNotificationId()).orElseThrow();
        notification.markAsRead();
    }

    @Transactional
    public void readAllNotification(Long memberId) {

        List<NotificationEntity> notificationList =
                notificationRepository.findByMemberIdAndReadAtIsNull(memberId);

        notificationList.forEach(NotificationEntity::markAsRead);
    }

    public int unReadCount(Long memberId) {
        int count = notificationRepository.countByMemberIdAndReadAtIsNull(memberId);
        return count;
    }
}
