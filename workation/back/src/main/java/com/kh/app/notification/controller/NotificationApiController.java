package com.kh.app.notification.controller;

import com.kh.app.notification.dto.request.NotificationCreateReqDto;
import com.kh.app.notification.dto.request.NotificationReadReqDto;
import com.kh.app.notification.dto.response.NotificationRespDto;
import com.kh.app.notification.entity.NotificationType;
import com.kh.app.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationApiController {

    private final NotificationService notificationService;

    @PostMapping
    public String  testCreate() {

        NotificationCreateReqDto dto = NotificationCreateReqDto.builder()
                .memberId(1L) //알림 받을 멤버id 번호 Long타입 변수로 처리하면 L안붙여도 됩니다!
                .type(NotificationType.RESERVATION_COMPLETE) // 알림타입
                .content("테스트 알림입니다.") // 알림 내용
                .redirectUrl("/mypage") // 알림 클릭햇을시 보내고 싶은 url
                .referenceId(1L) // 알림관련 식별번호 예약번호 or 상품번호 or 쿠폰번호 or 결제번호
                .build();

        notificationService.createNotification(dto);

        return "알림 생성 완료! 사용시 리턴은 굳이 복사 안해가셔도 됩니다.";
    }

    @GetMapping
    public List<NotificationRespDto> getNotificationList(@AuthenticationPrincipal(expression = "memberId") Long memberId){
        return notificationService.getNotificationList(memberId);
    }
    @PutMapping()
    public void isRead(@RequestBody NotificationReadReqDto dto){
        notificationService.isRead(dto);
    }
    @PatchMapping("/read-all")
    public void readAllNotification(
            @AuthenticationPrincipal(expression = "memberId")
            Long memberId
    ) {

        notificationService.readAllNotification(memberId);
    }
    @GetMapping("unread-count")
    public int unReadCount(
            @AuthenticationPrincipal(expression = "memberId")
            Long memberId
    ){
        return notificationService.unReadCount(memberId);
    }
}
