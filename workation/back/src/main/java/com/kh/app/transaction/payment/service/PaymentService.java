package com.kh.app.transaction.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.app.notification.dto.request.NotificationCreateReqDto;
import com.kh.app.notification.entity.NotificationType;
import com.kh.app.notification.service.NotificationService;
import com.kh.app.transaction.payment.dto.request.PaymentConfirmReqDto;
import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.payment.enums.PaymentMethod;
import com.kh.app.transaction.payment.enums.PaymentStatus;
import com.kh.app.transaction.payment.repository.PaymentRepository;
import com.kh.app.transaction.payout.service.PayoutService;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.repository.ReservationRepository;
import com.kh.app.transaction.sales.service.SalesService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class PaymentService {

    @Value("${toss.secret-key}")
    private String secretKey;

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final ObjectMapper objectMapper = new ObjectMapper(); // JSON 파싱용
    private final NotificationService notificationService;
    private final SalesService salesService;
    private final PayoutService payoutService;


    @Transactional
    public void confirmPayment(PaymentConfirmReqDto dto) {

        log.info(">>>> 현재 주입된 토스 키: [{}]", secretKey);

        if (paymentRepository.existsByPaymentKey(dto.getPaymentKey())) {
            throw new RuntimeException("이미 승인된 결제");
        }

        ReservationEntity reservation = reservationRepository.findById(dto.getReservationId())
                .orElseThrow(() -> new RuntimeException("예약 없음 (ID: " + dto.getReservationId() + ")"));

        try {
            RestTemplate restTemplate = new RestTemplate();


            restTemplate.getMessageConverters()
                    .add(0, new org.springframework.http.converter.StringHttpMessageConverter(java.nio.charset.StandardCharsets.UTF_8));

            String url = "https://api.tosspayments.com/v1/payments/confirm";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String encodedKey = Base64.getEncoder()
                    .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));
            headers.set("Authorization", "Basic " + encodedKey);

            Map<String, Object> body = Map.of(
                    "paymentKey", dto.getPaymentKey(),
                    "orderId", dto.getOrderId(),
                    "amount", dto.getAmount()
            );

            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, new HttpEntity<>(body, headers), String.class
            );

            // 이제 이 로그에서 한글이 깨지지 않고 "method":"간편결제", "provider":"카카오페이"로 정상 출력됩니다!
            log.info("Toss response: {}", response.getBody());

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("토스 승인 API 실패");
            }

            JsonNode root = objectMapper.readTree(response.getBody());

            String rawMethod = root.path("method").asText();
            PaymentMethod method = parsePaymentMethod(rawMethod, root);

            // 💡 [수정] 카드 정보 추출 시 방어 코드 및 한글 정제 로직 결합
            String cardCompany = null;
            String cardNumber = null;

            if (root.has("card") && !root.path("card").isNull()) {
                JsonNode cardNode = root.path("card");

                // 💡 company 대신 확실하게 존재하는 issuerCode(발급사 코드)를 읽어옵니다.
                String issuerCode = cardNode.path("issuerCode").asText(); // 예: "91"

                // 💡 코드를 기반으로 한글 이름을 매핑합니다.
                cardCompany = cleanCardCompanyName(issuerCode);
                cardNumber = cardNode.path("number").asText();
            }
            else if (root.has("easyPay") && !root.path("easyPay").isNull()) {
                JsonNode easyPayNode = root.path("easyPay");
                if (easyPayNode.has("provider")) {
                    cardCompany = easyPayNode.path("provider").asText();
                }
            }
            // 카카오페이/네이버페이 등 간편결제 시에도 카드사 컬럼에 결제 주체 명칭을 남기기 위한 백업
            else if (root.has("easyPay") && !root.path("easyPay").isNull()) {
                JsonNode easyPayNode = root.path("easyPay");
                if (easyPayNode.has("provider")) {
                    cardCompany = easyPayNode.path("provider").asText(); // "카카오페이" 등이 그대로 저장됨
                }
            }

            // 토스가 준 실제 승인 시간 파싱 (2026-05-21T14:35:09+09:00 형태 대응)
            LocalDateTime approvedAt = LocalDateTime.now();
            if (root.has("approvedAt")) {
                approvedAt = OffsetDateTime.parse(root.path("approvedAt").asText()).toLocalDateTime();
            }

            // 성공 내역 저장
            PaymentEntity payment = new PaymentEntity();
            payment.setReservation(reservation);
            payment.setOrderId(dto.getOrderId());
            payment.setPaymentKey(dto.getPaymentKey());
            payment.setAmount(dto.getAmount());
            payment.setPaymentMethod(method); // 동적 매핑 완료
            payment.setCardCompany(cardCompany);
            payment.setCardNumber(cardNumber);
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setApprovedAt(approvedAt);

            paymentRepository.save(payment);
            reservation.completePayment();

            // 1. 매출 원장 즉시 자동 생성
            salesService.recordSales(payment);

            NotificationCreateReqDto notificationCreateReqDto = NotificationCreateReqDto.builder()
                    .memberId(1L) //알림 받을 멤버id 번호 Long타입 변수로 처리하면 L안붙여도 됩니다!
                    .type(NotificationType.RESERVATION_COMPLETE) // 알림타입
                    .content("테스트 알림입니다.") // 알림 내용
                    .redirectUrl("/mypage") // 알림 클릭햇을시 보내고 싶은 url(셀러 승인거절 페이지 만들기)
                    .referenceId(1L) // 알림관련 식별번호 예약번호 or 상품번호 or 쿠폰번호 or 결제번호
                    .build();

            notificationService.createNotification(notificationCreateReqDto);

        } catch (Exception e) {
            log.error("결제 승인 중 예외 발생 -> 실패 기록 작업을 별도 트랜잭션으로 진행", e);

            // 💡 [핵심 수정] 자신의 프록시 객체나 빈을 직접 호출하는 대신,
            // 별도 트랜잭션 수단을 동반한 내부 로직으로 유도하거나 안전하게 저장 처리를 위임
            saveFailedPayment(reservation, dto, e.getMessage());

            throw new RuntimeException("결제 승인 실패: " + e.getMessage());
        }
    }

    /**
     * 💡 결제 실패 기록을 상위 트랜잭션 롤백에 상관없이 독립적으로 COMMIT 하는 메소드
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveFailedPayment(ReservationEntity reservation, PaymentConfirmReqDto dto, String errorMessage) {
        try {
            PaymentEntity failPayment = new PaymentEntity();
            failPayment.setReservation(reservation);
            failPayment.setOrderId(dto.getOrderId());
            failPayment.setPaymentKey(dto.getPaymentKey());
            failPayment.setAmount(dto.getAmount());
            failPayment.setPaymentMethod(PaymentMethod.CARD); // 실패 시엔 기본값 세팅
            failPayment.setStatus(PaymentStatus.FAILED);
            failPayment.setFailReason(errorMessage);

            paymentRepository.saveAndFlush(failPayment);
            log.info("❌ 결제 실패 내역 DB 저장 완료 (OrderId: {})", dto.getOrderId());
        } catch (Exception ex) {
            log.error("실패 내역 저장 중 추가 오류 발생", ex);
        }
    }

    /**
     * 💡 토스 결제 수단 문자열을 우리 프로젝트의 Enum으로 매핑하는 헬퍼 메소드
     */
    private PaymentMethod parsePaymentMethod(String rawMethod, JsonNode root) {
        // 1. 간편결제일 때 처리
        if ("간편결제".equals(rawMethod)) {
            if (root.has("easyPay") && !root.path("easyPay").isNull()) {
                String provider = root.path("easyPay").path("provider").asText().trim();

                // 토스 공식 문서 규격 및 한글 응답 매핑
                if ("카카오페이".equals(provider) || "KAKAOPAY".equalsIgnoreCase(provider)) {
                    return PaymentMethod.KAKAO_PAY;
                }
                if ("네이버페이".equals(provider) || "NAVERPAY".equalsIgnoreCase(provider)) {
                    return PaymentMethod.NAVER_PAY;
                }
                if ("토스페이".equals(provider) || "TOSSPAY".equalsIgnoreCase(provider)) {
                    return PaymentMethod.TOSS_PAY;
                }
                if ("삼성페이".equals(provider) || "SAMSUNGPAY".equalsIgnoreCase(provider)) {
                    return PaymentMethod.SAMSUNG_PAY;
                }
                if ("페이코".equals(provider) || "PAYCO".equalsIgnoreCase(provider)) {
                    return PaymentMethod.PAYCO;
                }
                if ("SSG페이".equals(provider) || "SSGPAY".equalsIgnoreCase(provider)) {
                    return PaymentMethod.SSG_PAY;
                }
                if ("엘페이".equals(provider) || "LPAY".equalsIgnoreCase(provider)) {
                    return PaymentMethod.L_PAY;
                }
            }
            // 간편결제인데 위에 등록되지 않은 신규 페이사가 들어온 경우 기본값 처리
            return PaymentMethod.CARD;
        }

        // 2. 일반 카드 결제일 때 처리
        if ("카드".equals(rawMethod)) {
            return PaymentMethod.CARD;
        }

        // 매칭되는 게 없거나 기본값
        return PaymentMethod.CARD;
    }

    /**
     * 💡 [추가] 토스 카드사 한글 이름을 판별하고 깔끔하게 표준 명칭으로 정제해 주는 헬퍼 메소드
     */
    /**
     * 💡 토스 카드사 코드 및 한글 이름을 기반으로 표준 명칭을 정제하는 메소드
     */
    /**
     * 💡 토스 공식 카드사 발급사 코드(issuerCode)를 우리 프로젝트 표준 명칭으로 정제
     */
    private String cleanCardCompanyName(String issuerCode) {
        if (issuerCode == null || issuerCode.isBlank() || "null".equals(issuerCode)) {
            return "미분류 카드사";
        }

        String code = issuerCode.trim();

        // 토스페이먼츠 공식 카드사 코드 규격 매핑
        switch (code) {
            case "36": case "NONGHYUP": return "NH농협카드";
            case "61": case "HYUNDAI":  return "현대카드";
            case "41": case "SHINHAN":  return "신한카드";
            case "11": case "KOOKMIN":  return "KB국민카드";
            case "51": case "SAMSUNG":  return "삼성카드";
            case "21": case "BC":       return "BC카드";
            case "31": case "HANA":     return "하나카드";
            case "71": case "LOTTE":    return "롯데카드";
            case "91": case "KAKAOBANK":return "카카오뱅크";
            case "24": case "TOSSBANK": return "토스뱅크";
            case "32": return "광주은행";
            case "33": return "전북은행";
            case "34": return "제주은행";
            case "35": return "수협은행";
            case "42": return "제주은행";
            case "52": return "씨티카드";
            case "72": return "우체국";
            default: return "기타카드(" + code + ")"; // 혹시 모를 신규 카드사 대응
        }
    }

    /**
     * 💡 판매자 전용: 예약 확정 승인 기능
     */
    @Transactional
    public void approveReservation(Long id, String sellerUsername) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("예약 건을 찾을 수 없습니다."));

        // 소유권 검증 (내 공간에 들어온 예약인지 확인)
        if (!reservation.getStay().getSpace().getSeller().getUsername().equals(sellerUsername)) {
            throw new IllegalArgumentException("해당 예약에 대한 승인 권한이 없습니다.");
        }

        reservation.approveBySeller(); // RESERVED 상태 전환

        // 구매자에게 예약이 확정되었다고 알림 전송 (선택 구현 가능)
        NotificationCreateReqDto notifyUser = NotificationCreateReqDto.builder()
                .memberId(reservation.getMember().getId())
                .type(NotificationType.RESERVATION_COMPLETE) // 적절한 유형 매핑
                .content("[" + reservation.getStay().getName() + "] 숙소 예약이 판매자에 의해 확정되었습니다!")
                .redirectUrl("/mypage/reservation")
                .referenceId(reservation.getId())
                .build();
        notificationService.createNotification(notifyUser);
    }

    /**
     * 💡 판매자 전용: 예약 거절 및 취소 기능
     */
    @Transactional
    public void cancelReservationBySeller(Long id, String sellerUsername) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("예약 건을 찾을 수 없습니다."));

        if (!reservation.getStay().getSpace().getSeller().getUsername().equals(sellerUsername)) {
            throw new IllegalArgumentException("해당 예약에 대한 취소 권한이 없습니다.");
        }

        reservation.cancelBySeller(); // SELLER_CANCELLED 상태 전환

        // ⚠️ 중요: 판매자가 취소했으므로 전액 환불 로직 연동 필요
        // 기존에 만드신 환불 서비스가 있다면 여기서 연이어 호출해 줍니다.
        // refundService.processRefundBySystem(reservation);
    }

    /**
     * 💡 구매자(또는 시스템 스케줄러) 전용: 이용 완료 확정 기능 (★정산 연동 시점)
     */
    @Transactional
    public void completeReservation(Long id, String username) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("예약 정보를 찾을 수 없습니다."));
        if (!reservation.getMember().getUsername().equals(username)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }
        reservation.completeUsage(); // COMPLETED 상태 변경

        PaymentEntity payment = paymentRepository.findByReservation(reservation)
                .orElseThrow(() -> new EntityNotFoundException("결제 내역이 존재하지 않습니다."));

        com.kh.app.transaction.sales.entity.SalesEntity sales = salesService.findByPaymentId(payment.getId());
        payoutService.createPayoutTarget(sales);
    }
}