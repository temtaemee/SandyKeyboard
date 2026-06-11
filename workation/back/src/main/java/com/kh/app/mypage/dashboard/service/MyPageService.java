package com.kh.app.mypage.dashboard.service;

import com.kh.app.member.service.MemberService;
import com.kh.app.member.dto.response.MemberMeRespDto;
import com.kh.app.middle.coupon.dto.response.MemberCouponRespDto;
import com.kh.app.middle.coupon.service.CouponService;
import com.kh.app.mypage.dashboard.dto.response.MyPageDashboardRespDto;
import com.kh.app.product.space.dto.response.SpaceResDto;
import com.kh.app.product.space.service.SpaceService;
import com.kh.app.product.stay.dto.response.StayResDto;
import com.kh.app.product.stay.service.StayService;
import com.kh.app.transaction.reservation.service.ReservationService;
import com.kh.app.transaction.reservation.dto.response.ReservationResDto;
import com.kh.app.transaction.reservation.entity.ReservationStatus; // 이넘 임포트 ✨
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class MyPageService {
    private final MemberService memberService;
    private final ReservationService reservationService;
    private final CouponService couponService;
    private final StayService stayService;
    private final SpaceService spaceService;

    @Value("${app.public-base-url:http://localhost:8001}")
    private String publicBaseUrl;

    private static final List<String> INVALID_STATUSES = List.of(
            ReservationStatus.USER_CANCELLED.name(),
            ReservationStatus.SELLER_CANCELLED.name(),
            ReservationStatus.REFUND_COMPLETED.name()
    );

    public MyPageDashboardRespDto getDashboardData(Long memberId, String username) {

        // 1. 회원 정보 조회
        MemberMeRespDto memberInfoDto = memberService.getMyInfo(username);

        // 2. 예약 목록 조회
        List<ReservationResDto> myReservations = reservationService.getMyReservations(username);

        // 3. 쿠폰 개수 동적 필터링 조회
        Page<MemberCouponRespDto> couponPage = couponService.getCouponList(username, 0);
        long availableCouponCount = couponPage.getContent().stream()
                .filter(coupon -> "N".equals(coupon.getUsedYn())).count();

        // ================= ⭐ 하드코딩 통계 데이터 깨부수기 시작 ⭐ =================

        int currentYear = LocalDate.now().getYear();

        // ① 올해 이용 완료된 총 워케이션 일수 계산 (COMPLETED 상태 기준)
        long totalWorkationDays = myReservations.stream()
                .filter(res -> ReservationStatus.COMPLETED.name().equals(res.getStatus())) // "COMPLETED" 필터링 ✨
                .filter(res -> res.getCheckinDate() != null && res.getCheckinDate().getYear() == currentYear) // 올해 예약만 ✨
                .mapToLong(res -> ChronoUnit.DAYS.between(res.getCheckinDate(), res.getCheckoutDate())) // 박수(일수) 계산 ✨
                .sum();

        // ② 이용 완료된 숙소를 기반으로 방문 지역(혹은 방문 숙소) 수 계산
        long visitedRegionsCount = myReservations.stream()
                .filter(res -> ReservationStatus.COMPLETED.name().equals(res.getStatus()))
                .map(ReservationResDto::getStayId) // stayId 추출 ✨
                .distinct() // 중복 제거 (같은 곳 여러번 간 건 1곳으로 카운트) ✨
                .count();

        // 예정된 예약 건수 동적 계산 (예약 대기, 결제 완료, 예약 확정 상태인 예약 건수)
        long upcomingCount = myReservations.stream()
                .filter(res -> List.of("PENDING", "PAYMENT_COMPLETED", "RESERVED").contains(res.getStatus()))
                .count();

        // 4. 현재 진행 중인 예약 필터링 (취소/환불되지 않은 유효한 예약 중 첫 번째 건)
        ReservationResDto currentValidRes = myReservations.stream()
                .filter(res -> res.getStatus() != null)
                .filter(res -> !INVALID_STATUSES.contains(res.getStatus())) // 취소, 환불 제외 💡
                .findFirst() // 조건에 맞는 가장 첫 번째 건 추출 💡
                .orElse(null);

        MyPageDashboardRespDto.CurrentReservationDto currentResDto = null;
        if (currentValidRes != null) {
            try {
                StayResDto stayInfo = stayService.selectOne(currentValidRes.getStayId());
                SpaceResDto spaceInfo = spaceService.selectOne(stayInfo.getSpaceId());

                String mainImageUrl = (spaceInfo.getPictures() != null && !spaceInfo.getPictures().isEmpty())
                        ? spaceInfo.getPictures().get(0).getFilePath()
                        : defaultSpaceImageUrl();

                currentResDto = MyPageDashboardRespDto.CurrentReservationDto.builder()
                        .reservationId(currentValidRes.getId())
                        .workspaceName(currentValidRes.getStayName())
                        .roomTypeName(stayInfo.getName())
                        .startDate(currentValidRes.getCheckinDate() != null ? currentValidRes.getCheckinDate().atStartOfDay() : null)
                        .endDate(currentValidRes.getCheckoutDate() != null ? currentValidRes.getCheckoutDate().atStartOfDay() : null)
                        .locationAddress(spaceInfo.getAddress1())
                        .roomImageUrl(mainImageUrl)
                        .build();
            } catch (Exception e) {
                log.error("마이페이지 대시보드 상품 연동 중 에러 발생 (임시 데이터 대체)", e);
            }
        }

        // 5. 지난 워케이션 다시 보기 매핑 (현재 예약으로 노출된 건은 제외하고, 취소 안 된 건 최대 2건)
        final Long currentResId = (currentValidRes != null) ? currentValidRes.getId() : null; // 비교용 ID 추출

        List<MyPageDashboardRespDto.PastWorkationDto> pastList = myReservations.stream()
                .filter(res -> res.getStatus() != null)
                .filter(res -> !INVALID_STATUSES.contains(res.getStatus())) // 취소, 환불 제외 💡
                .filter(res -> currentResId == null || !res.getId().equals(currentResId))    // 현재 대시보드 뜬 건 제외 💡
                .limit(2) // 최대 2건
                .map(res -> {
                    String pastImageUrl = defaultSpaceImageUrl();
                    try {
                        StayResDto stayInfo = stayService.selectOne(res.getStayId());
                        // 💡 [변경] 지난 워케이션도 SpaceService를 연동해 공간의 사진을 가져옵니다.
                        SpaceResDto spaceInfo = spaceService.selectOne(stayInfo.getSpaceId());
                        if (spaceInfo.getPictures() != null && !spaceInfo.getPictures().isEmpty()) {
                            pastImageUrl = spaceInfo.getPictures().get(0).getFilePath();
                        }
                    } catch (Exception ignored) {}

                    return MyPageDashboardRespDto.PastWorkationDto.builder()
                            .reservationId(res.getId())
                            .workspaceName(res.getStayName())
                            .startDate(res.getCheckinDate() != null ? res.getCheckinDate().atStartOfDay() : null)
                            .endDate(res.getCheckoutDate() != null ? res.getCheckoutDate().atStartOfDay() : null)
                            .workspaceImageUrl(pastImageUrl)
                            .build();
                })
                .toList();

        // 6. 최종 대시보드 데이터 조립 반환
        return MyPageDashboardRespDto.builder()
                .memberId(memberInfoDto.getMemberId())
                .name(memberInfoDto.getName())
                .joinDate(memberInfoDto.getJoinDate())
                .totalWorkationDays((int) totalWorkationDays)       // 동적 대입 완료! ✨
                .visitedRegionsCount((int) visitedRegionsCount)     // 동적 대입 완료! ✨
                .upcomingReservationsCount((int) upcomingCount)     // 이 부분도 덤으로 완벽 동적 처리! ✨
                .availableCouponCount((int) availableCouponCount)
                .currentReservation(currentResDto)
                .pastWorkations(pastList)
                .build();
    }

    private String defaultSpaceImageUrl() {
        String baseUrl = publicBaseUrl == null ? "" : publicBaseUrl.replaceAll("/+$", "");
        return baseUrl + "/dummy-images/gangwon/hotel1/강원1외관.png";
    }
}
