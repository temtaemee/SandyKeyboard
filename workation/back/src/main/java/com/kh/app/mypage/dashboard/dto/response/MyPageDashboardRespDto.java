package com.kh.app.mypage.dashboard.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class MyPageDashboardRespDto {

    // 1. 프로필 & 기본 통계 영역
    private Long memberId;
    private String name;
    private String grade;          // 예: "SHORELINE GOLD"
    private LocalDateTime joinDate;
    private Integer totalWorkationDays; // 올해 워케이션 일수 (예: 12)
    private Integer visitedRegionsCount; // 방문 지역 수 (예: 5)
    private Integer upcomingReservationsCount; // 예정 예약 건수 (예: 2)

    // 2. 퀵메뉴 뱃지 연동용
    private Integer availableCouponCount;      // 사용 가능한 쿠폰 수 (예: 3)

    // 3. 현재 진행 중인 예약 영역 (단건 혹은 null)
    private CurrentReservationDto currentReservation;

    // 4. 지난 워케이션 다시 보기 영역 (최신순 최대 2~3건)
    private List<PastWorkationDto> pastWorkations;

    // --- 내부 계층 구조 DTO 정의 ---

    @Getter
    @Builder
    public static class CurrentReservationDto {
        private Long reservationId;
        private String workspaceName;      // 예: "부산 씨사이드 허브"
        private String roomTypeName;       // 예: "오션뷰 스튜디오 워크룸"
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private String locationAddress;    // 예: "부산광역시 해운대구"
        private String roomImageUrl;       // Unsplash 또는 S3 주소
    }

    @Getter
    @Builder
    public static class PastWorkationDto {
        private Long reservationId;
        private String workspaceName;      // 예: "제주 하이브 스테이"
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private String workspaceImageUrl;
    }
}