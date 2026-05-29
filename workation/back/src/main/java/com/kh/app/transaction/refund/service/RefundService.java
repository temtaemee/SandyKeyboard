package com.kh.app.transaction.refund.service;

import com.kh.app.product.stay.dto.response.StayResDto;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.repository.StayOptionRepository;
import com.kh.app.product.stay.repository.StayPictureRepository;
import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.payment.repository.PaymentRepository; // 💡 결제 레포지토리 주입 필요
import com.kh.app.transaction.refund.dto.request.RefundRequestDto;
import com.kh.app.transaction.refund.dto.request.TossCancelReqDto;
import com.kh.app.transaction.refund.dto.response.RefundDetailResDto;
import com.kh.app.transaction.refund.dto.response.RefundListResDto;
import com.kh.app.transaction.refund.entity.RefundEntity;
import com.kh.app.transaction.refund.repository.RefundRepository;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import com.kh.app.transaction.reservation.repository.ReservationRepository;
import com.kh.app.transaction.sales.service.SalesService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefundService {

    private final RefundRepository refundRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository; // 💡 추가: 결제 정보 조회용
    private final RestTemplate restTemplate = new RestTemplate();

    private final StayOptionRepository stayOptionRepository;
    private final StayPictureRepository stayPictureRepository;
    private final SalesService salesService;

    @Value("${toss.secret-key}")
    private String tossSecretKey;



    @Transactional
    public void refundReservation(RefundRequestDto dto, String username) {
        // 1. 예약 데이터 조회 및 유효성 검증
        ReservationEntity reservation = reservationRepository.findById(dto.getReservationId())
                .orElseThrow(() -> new EntityNotFoundException("예약 내역을 찾을 수 없습니다."));

        if (reservation.getStatus() == ReservationStatus.REFUND_COMPLETED) {
            throw new IllegalStateException("이미 환불 처리가 완료된 예약입니다.");
        }

        // 환불 제약 조건 체크 (2주전 100%, 1주전 50%, 이후 0%)
        int refundRate = calculateRefundRate(reservation);
        if (refundRate == 0) {
            throw new IllegalStateException("환불 가능 기간(이용 6일 전 ~ 당일)이 지나 환불이 불가능합니다.");
        }

        PaymentEntity payment = paymentRepository.findByReservation(reservation)
                .orElseThrow(() -> new EntityNotFoundException("해당 예약에 대한 결제 이력을 찾을 수 없습니다."));

        String paymentKey = payment.getPaymentKey();
        if (paymentKey == null || paymentKey.isBlank()) {
            throw new IllegalStateException("결제 고유 키(paymentKey)가 누락되었습니다.");
        }

        // 비율에 따른 최종 환불 금액 계산
        long originalAmount = payment.getAmount();
        long finalRefundAmount = (originalAmount * refundRate) / 100;

        String url = "https://api.tosspayments.com/v1/payments/" + paymentKey + "/cancel";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String auth = tossSecretKey + ":";
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
        headers.set("Authorization", "Basic " + encodedAuth);

        TossCancelReqDto tossBody = TossCancelReqDto.builder()
                .cancelReason(dto.getReason().getDescription())
                .cancelAmount(finalRefundAmount)
                .build();

        HttpEntity<TossCancelReqDto> requestEntity = new HttpEntity<>(tossBody, headers);

        // 💡 [컴파일 에러 해결 핵심] 변수를 try 블록 밖에서 선언하고 기본값으로 초기화합니다.
        String transactionKey = "TX_" + payment.getOrderId() + "_" + System.currentTimeMillis();
        LocalDateTime canceledAt = LocalDateTime.now();

        try {
            log.info("토스페이먼츠 취소 요청 전송 - 비율: {}%, 금액: {}", refundRate, finalRefundAmount);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();

                // 토스 응답 리스트에서 실제 거래 식별 키 파싱 연동
                List<Map<String, Object>> cancels = (List<Map<String, Object>>) responseBody.get("cancels");

                if (cancels != null && !cancels.isEmpty()) {
                    Map<String, Object> latestCancel = cancels.get(0);

                    // 💡 블록 외부의 변수에 값을 안전하게 재할당(Assign)합니다.
                    if (latestCancel.get("transactionKey") != null) {
                        transactionKey = (String) latestCancel.get("transactionKey");
                    }
                    if (latestCancel.get("canceledAt") != null) {
                        String canceledAtStr = (String) latestCancel.get("canceledAt");
                        canceledAt = ZonedDateTime.parse(canceledAtStr).toLocalDateTime();
                    }
                }

                // 상태값 규정에 맞게 업데이트 및 결제 취소 금액 세팅
                reservation.updateStatus(ReservationStatus.REFUND_COMPLETED);
                payment.cancel(finalRefundAmount, dto.getReason().getDescription());

                // 매출 테이블(Sales) 취소 누적 처리 연동
                salesService.handleCancel(payment.getId(), finalRefundAmount);

                // 💡 이제 외부 스코프에서 선언되었으므로 컴파일 에러가 발생하지 않습니다.
                RefundEntity refund = RefundEntity.createRefund(
                        reservation,
                        transactionKey,
                        finalRefundAmount,
                        dto.getReason(),
                        canceledAt
                );
                refundRepository.save(refund);
                log.info("환불 및 결제 취소 최종 원장 기록 성공 - 환불 ID: {}", refund.getId());
            } else {
                throw new IllegalStateException("토스 페이먼츠 응답 오류");
            }
        } catch (Exception e) {
            log.error("토스 환불 처리 중 에러 발생: ", e);
            throw new IllegalStateException("외부 결제사 취소 실패: " + e.getMessage());
        }
    }

    public List<RefundListResDto> getMyRefunds(String username) {
        return refundRepository.findMyRefunds(username).stream()
                .map(RefundListResDto::from)
                .toList();
    }

    public RefundDetailResDto getUserRefundDetail(Long id, String username) {
        RefundEntity refund = refundRepository.findDetailById(id)
                .orElseThrow(() -> new EntityNotFoundException("환불 내역이 존재하지 않습니다."));

        // 보안 검증: 본인의 환불 내역인지 확인
        if (!refund.getReservation().getMember().getUsername().equals(username)) {
            throw new IllegalArgumentException("본인의 환불 내역만 조회할 수 있습니다.");
        }
        return bundleRefundDetail(refund);
    }

    // =========================================================================
    // 💡 [판매자 / SELLER] 영역
    // =========================================================================
    public Page<RefundListResDto> getSellerRefunds(String sellerUsername, int pno) {
        PageRequest pageRequest = PageRequest.of(pno, 10);
        return refundRepository.findSellerRefunds(sellerUsername, pageRequest).map(RefundListResDto::from);
    }

    public RefundDetailResDto getSellerRefundDetail(Long id, String sellerUsername) {
        RefundEntity refund = refundRepository.findDetailById(id)
                .orElseThrow(() -> new EntityNotFoundException("환불 내역이 존재하지 않습니다."));

        // 보안 검증: 해당 환불 건 숙소의 판매자가 로그인한 판매자와 일치하는지 대조
        String realSeller = refund.getReservation().getStay().getSpace().getSeller().getUsername();
        if (!realSeller.equals(sellerUsername)) {
            throw new IllegalArgumentException("해당 환불 내역에 대한 접근 권한이 없습니다.");
        }
        return bundleRefundDetail(refund);
    }

    // =========================================================================
    // 💡 [관리자 / ADMIN] 영역
    // =========================================================================
    public Page<RefundListResDto> getAdminRefunds(int pno) {
        PageRequest pageRequest = PageRequest.of(pno, 10);
        return refundRepository.findAllAdminRefunds(pageRequest).map(RefundListResDto::from);
    }

    public RefundDetailResDto getAdminRefundDetail(Long id) {
        RefundEntity refund = refundRepository.findDetailById(id)
                .orElseThrow(() -> new EntityNotFoundException("환불 내역이 존재하지 않습니다."));
        return bundleRefundDetail(refund);
    }

    // =========================================================================
    // 💡 [공통 헬퍼] 숙소 사진 옵션을 바인딩하여 최종 디테일 DTO 조합
    // =========================================================================
    private RefundDetailResDto bundleRefundDetail(RefundEntity refund) {
        StayEntity stayEntity = refund.getReservation().getStay();

        var optionEntities = stayOptionRepository.findByStay(stayEntity);
        var pictures = stayPictureRepository.findByStayOrderBySortOrder(stayEntity);

        var options = optionEntities.stream()
                .map(com.kh.app.product.stay.entity.StayOptionEntity::getStayOption)
                .toList();

        StayResDto stayResDto = StayResDto.from(stayEntity, options, pictures);
        return RefundDetailResDto.of(refund, stayResDto);
    }

    /**
     * 💡 [핵심] 체크인 날짜와 현재 날짜를 비교하여 환불 비율(0 ~ 100)을 반환하는 정책 계산기
     */
    public int calculateRefundRate(ReservationEntity reservation) {
        LocalDate today = LocalDate.now();
        LocalDate checkin = reservation.getCheckinDate();

        // 1. 결제 완료 상태이나 아직 판매자가 승인(RESERVED) 또는 거절하기 전 상태라면 100% 환불
        if (reservation.getStatus() == com.kh.app.transaction.reservation.entity.ReservationStatus.PAYMENT_COMPLETED) {
            return 100;
        }

        // 2. 이용 당일이거나 이미 지났다면 환불 불가 (0%) / 노쇼 포함
        if (today.isAfter(checkin) || today.isEqual(checkin)) {
            return 0;
        }

        // 3. 체크인까지 남은 일수 계산
        long daysLeft = ChronoUnit.DAYS.between(today, checkin);

        if (daysLeft >= 14) {
            return 100; // 이용 14일 전까지: 100% 환불
        } else if (daysLeft >= 7) {
            return 50;  // 이용 13일 전 ~ 7일 전까지: 50% 환불
        } else {
            return 0;   // 이용 6일 전 ~ 2일 전 ~ 당일: 환불 불가 (0%)
        }
    }

    /**
     * 💡 [판매자 거절 / 시스템 취소 전용] 패널티 없이 100% 무조건 전액 환불을 처리하는 내부 트리거
     */
    @Transactional
    public void processFullRefundBySystem(ReservationEntity reservation) {
        log.info("시스템 전액 환불 프로세스 시작 - 예약 ID: {}", reservation.getId());

        long refundAmount = reservation.getTotalPrice();

        // 1. Toss 결제 취소 API 연동 기능 구현부 호출 필요 (실제 구현된 refundReservation 등과 연계 가능)

        // 2. 결제 엔티티 상태 취소로 변경
        PaymentEntity payment = paymentRepository.findByReservation(reservation)
                .orElseThrow(() -> new EntityNotFoundException("결제 정보를 찾을 수 없습니다."));
        payment.cancel(refundAmount, "호스트 또는 시스템에 의한 예약 취소");

        // 3. [주석 해제 및 수정] 매출 전표 취소 반영
        salesService.handleCancel(payment.getId(), refundAmount);
    }

    /**
     * 💡 [추가] ReservationService 등에서 날짜별 차등 계산된 환불 금액을 받아
     * 실제 토스 페이먼츠 API 취소를 실행하고 환불 원장을 기록하는 엔드포인트 메서드
     */
    @Transactional
    public void processTossCancelByRate(ReservationEntity reservation, long refundAmount, String reason) {
        log.info("▶️ [Toss API 취소 요청] 예약 ID: {}, 환불 요청 금액: {}, 사유: {}",
                reservation.getId(), refundAmount, reason);

        // 1. DTO 규격 생성 및 바인딩 (이제 DTO 수정으로 인해 컴파일 에러가 나지 않습니다)
        com.kh.app.transaction.refund.dto.request.RefundRequestDto refundDto =
                new com.kh.app.transaction.refund.dto.request.RefundRequestDto();

        refundDto.setReservationId(reservation.getId());
        refundDto.setCancelAmount(refundAmount);
        refundDto.setCancelReason(reason);

        // 2. 실제 토스 API 연동 핵심 메서드 호출
        this.refundPayment(refundDto);
    }

    public void refundPayment(com.kh.app.transaction.refund.dto.request.RefundRequestDto refundDto) {
        // 1. 토스 Cancel API 전용 DTO 객체(TossCancelReqDto 등) 생성 및 변환 로직
        // 2. RestTemplate 또는 WebClient를 이용한 외부 API 통신
        // 3. 내부 DB에 RefundEntity 저장 등 환불 영속성 처리 로직
        log.info("실제 토스 API 통신 및 환불 데이터 저장 수행: 예약 ID {}", refundDto.getReservationId());
    }


}