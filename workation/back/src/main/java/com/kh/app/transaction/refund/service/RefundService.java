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
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
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

        // 2. 💡 [핵심] 해당 예약에 매핑된 결제 원장(PaymentEntity) 찾기
        PaymentEntity payment = paymentRepository.findByReservation(reservation)
                .orElseThrow(() -> new EntityNotFoundException("해당 예약에 대한 결제 이력을 찾을 수 없습니다."));

        String paymentKey = payment.getPaymentKey();
        if (paymentKey == null || paymentKey.isBlank()) {
            throw new IllegalStateException("결제 고유 키(paymentKey)가 누락되어 토스 환불이 불가능합니다.");
        }

        // 3. 토스페이먼츠 취소 API URL 조립 (진짜 paymentKey 매핑!)
        String url = "https://api.tosspayments.com/v1/payments/" + paymentKey + "/cancel";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 토스 Basic Auth 인증 헤더 구성
        String auth = tossSecretKey + ":";
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
        headers.set("Authorization", "Basic " + encodedAuth);

        TossCancelReqDto tossBody = TossCancelReqDto.builder()
                .cancelReason(dto.getReason().getDescription()) // Enum에서 한글 사유 추출
                .cancelAmount(payment.getAmount())              // 전액 취소 (최초 결제 금액 전체)
                .build();

        HttpEntity<TossCancelReqDto> requestEntity = new HttpEntity<>(tossBody, headers);

        try {
            log.info("토스페이먼츠 취소 요청 전송 - 결제키: {}, 금액: {}", paymentKey, payment.getAmount());

            // 토스 서버로 취소 POST 통신
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();

                // 토스 응답에서 취소 상세 내역 파싱
                List<Map<String, Object>> cancels = (List<Map<String, Object>>) responseBody.get("cancels");
                String transactionKey = "TX_" + payment.getOrderId() + "_" + System.currentTimeMillis();
                LocalDateTime canceledAt = LocalDateTime.now();

                if (cancels != null && !cancels.isEmpty()) {
                    Map<String, Object> latestCancel = cancels.get(0);
                    transactionKey = (String) latestCancel.get("transactionKey");
                    String canceledAtStr = (String) latestCancel.get("canceledAt");
                    canceledAt = ZonedDateTime.parse(canceledAtStr).toLocalDateTime();
                }

                // 4. 💡 예약 엔티티 및 결제 엔티티 내부 상태 더티 체킹으로 동시 변경
                if (reservation.getStatus() == ReservationStatus.PAYMENT_COMPLETED) {
                    reservation.cancelByUser();
                }
                reservation.refund(); // 예약 상태 -> REFUND_COMPLETED

                // 💡 제공해주신 PaymentEntity 내부 편의 메소드 매커니즘 작동
                payment.cancel(payment.getAmount(), dto.getReason().getDescription());

                // 5. 환불 원장 테이블(RefundEntity) 기록 저장
                RefundEntity refund = RefundEntity.createRefund(
                        reservation,
                        transactionKey,
                        payment.getAmount(),
                        dto.getReason(),
                        canceledAt
                );
                refundRepository.save(refund);
                log.info("환불 및 결제 취소 최종 원장 기록 성공 - 환불 ID: {}", refund.getId());
            }
        } catch (Exception e) {
            log.error("토스페이먼츠 환불 연동 중 통신 실패: ", e);
            throw new IllegalStateException("외부 결제사 취소 거부: " + e.getMessage());
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



}