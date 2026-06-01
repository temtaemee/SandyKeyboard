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

        // ================= ⭐ 하드코딩 통계 데이터 깨부수기 끝 ⭐ =================

        // 4. 첫 번째 예약 정보가 있다면 방 상세 정보 및 공간 주소 연동 처리
        MyPageDashboardRespDto.CurrentReservationDto currentResDto = null;
        if (!myReservations.isEmpty()) {
            ReservationResDto res = myReservations.get(0);

            try {
                StayResDto stayInfo = stayService.selectOne(res.getStayId());
                SpaceResDto spaceInfo = spaceService.selectOne(stayInfo.getSpaceId());

                String mainImageUrl = (stayInfo.getPictures() != null && !stayInfo.getPictures().isEmpty())
                        ? stayInfo.getPictures().get(0).getFilePath()
                        : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200";

                currentResDto = MyPageDashboardRespDto.CurrentReservationDto.builder()
                        .reservationId(res.getId())
                        .workspaceName(res.getStayName())
                        .roomTypeName(stayInfo.getName())
                        .startDate(res.getCheckinDate() != null ? res.getCheckinDate().atStartOfDay() : null)
                        .endDate(res.getCheckoutDate() != null ? res.getCheckoutDate().atStartOfDay() : null)
                        .locationAddress(spaceInfo.getAddress1())
                        .roomImageUrl(mainImageUrl)
                        .build();
            } catch (Exception e) {
                log.error("마이페이지 대시보드 상품 연동 중 에러 발생 (임시 데이터 대체)", e);
            }
        }

        // 5. 지난 워케이션 다시 보기 매핑 (최대 2건)
        List<MyPageDashboardRespDto.PastWorkationDto> pastList = myReservations.stream()
                .skip(1)
                .limit(2)
                .map(res -> {
                    String pastImageUrl = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400";
                    try {
                        StayResDto stayInfo = stayService.selectOne(res.getStayId());
                        if (stayInfo.getPictures() != null && !stayInfo.getPictures().isEmpty()) {
                            pastImageUrl = stayInfo.getPictures().get(0).getFilePath();
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
}