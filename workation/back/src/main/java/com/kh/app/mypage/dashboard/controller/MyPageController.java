package com.kh.app.mypage.dashboard.controller;

import com.kh.app.mypage.dashboard.dto.response.MyPageDashboardRespDto;
import com.kh.app.mypage.dashboard.service.MyPageService;
import com.kh.app.security.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/mypage")
@RequiredArgsConstructor
@Slf4j
public class MyPageController {
    private final MyPageService myPageService;
    @GetMapping
    public ResponseEntity<MyPageDashboardRespDto> viewDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        Long memberId = userDetails.getMemberId();
        String username = userDetails.getUsername();
        MyPageDashboardRespDto respDto = myPageService.getDashboardData(memberId,username);
        return ResponseEntity.ok(respDto);
    }
}
