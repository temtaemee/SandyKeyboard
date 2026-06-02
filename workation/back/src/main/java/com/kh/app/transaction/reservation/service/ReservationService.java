package com.kh.app.transaction.reservation.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.middle.coupon.entity.MemberCouponEntity;
import com.kh.app.middle.coupon.repository.CouponRepository; // 💡 쿠폰 레포지토리 주입 추가
import com.kh.app.middle.coupon.repository.MemberCouponRepository;
import com.kh.app.notification.dto.request.NotificationCreateReqDto;
import com.kh.app.notification.entity.NotificationType;
import com.kh.app.notification.service.NotificationService;
import com.kh.app.product.space.dto.response.SpaceResDto;
import com.kh.app.product.stay.dto.response.StayResDto;
import com.kh.app.product.stay.entity.StayEntity;               // 💡 숙소 엔티티 추가
import com.kh.app.product.stay.entity.StayOption;
import com.kh.app.product.stay.entity.StayPictureEntity;
import com.kh.app.product.stay.repository.StayOptionRepository;
import com.kh.app.product.stay.repository.StayPictureRepository;
import com.kh.app.product.stay.repository.StayRepository;
import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.payment.repository.PaymentRepository;
import com.kh.app.transaction.payout.service.PayoutService;
import com.kh.app.transaction.refund.service.RefundService;
import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
import com.kh.app.transaction.reservation.dto.request.ReservationUpdateReqDto;
import com.kh.app.transaction.reservation.dto.response.ReservationAdminListResDto;
import com.kh.app.transaction.reservation.dto.response.ReservationDetailResDto;
import com.kh.app.transaction.reservation.dto.response.ReservationResDto;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import com.kh.app.transaction.reservation.entity.ReserveFileEntity;
import com.kh.app.transaction.reservation.repository.ReservationRepository;
import com.kh.app.transaction.reservation.repository.ReserveFileRepository;
import com.kh.app.transaction.sales.service.SalesService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReserveFileRepository reserveFileRepository;
    private final MemberRepository memberRepository;
    private final S3Service s3Service;
    private final StayRepository stayRepository;
    private final MemberCouponRepository memberCouponRepository;
    private final PaymentRepository paymentRepository;
    private final StayPictureRepository stayPictureRepository;
    private final StayOptionRepository stayOptionRepository;
    private final NotificationService notificationService;
    private final SalesService salesService;
    private final PayoutService payoutService;
    private final RefundService refundService;



    /**
     * 숙소예약 생성 로직
     */
    @Transactional
    public Map<String, Object> create(
            String username,
            Long stayId,
            ReservationCreateReqDto dto,
            List<MultipartFile> fileList
    ) throws IOException {

        // [추가] 중복 예약 방지 최종 검증 차단막
        long duplicateCount = reservationRepository.countDuplicateReservations(stayId, dto.getCheckinDate(), dto.getCheckoutDate());
        if (duplicateCount > 0) {
            throw new IllegalStateException("선택하신 기간은 이미 다른 회원의 예약이 완료된 일정입니다. 다른 날짜를 선택해 주세요.");
        }


        // 1~4. 회원, 날짜, 숙소, 인원 검증 로직 (기존과 완벽히 동일)
        MemberEntity memberEntity = memberRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND"));

        if (dto.getCheckinDate().isAfter(dto.getCheckoutDate()) || dto.getCheckinDate().isEqual(dto.getCheckoutDate())) {
            throw new IllegalArgumentException("체크인 날짜는 체크아웃 날짜보다 앞서야 합니다.");
        }

        StayEntity stay = stayRepository.findById(stayId)
                .orElseThrow(() -> new EntityNotFoundException("STAY NOT FOUND"));

        if (dto.getGuestCount() > stay.getMaxCapa()) {
            throw new IllegalArgumentException("숙소 최대 수용 인원을 초과할 수 없습니다.");
        }

        // 5. 요일별 실시간 요금 합산 알고리즘 연동
        long originalPrice = calculateOriginalPrice(stay, dto.getCheckinDate(), dto.getCheckoutDate());

        // 6. 팀원 쿠폰 엔티티와 연동한 비율 할인 연산
        CouponEntity coupon = null;
        long discountAmount = 0L;

        if (dto.getCouponId() != null) {
            MemberCouponEntity memberCoupon = memberCouponRepository.findById(dto.getCouponId())
                    .orElseThrow(() -> new EntityNotFoundException("쿠폰 정보가 존재하지 않습니다."));

            if (!memberCoupon.getMember().getUsername().equals(username)) {
                throw new IllegalArgumentException("본인의 쿠폰만 사용할 수 있습니다.");
            }

            if (memberCoupon.isUsed() || memberCoupon.isExpired()) {
                throw new IllegalStateException("이미 사용되었거나 만료된 쿠폰입니다.");
            }

            coupon = memberCoupon.getCouponId();
            coupon.decrementQty();
            memberCoupon.useCoupon();

            discountAmount = (originalPrice * coupon.getDiscountRate()) / 100;
            if (discountAmount > originalPrice) {
                discountAmount = originalPrice;
            }
        }

        long totalPrice = originalPrice - discountAmount;
        if (totalPrice < 0) totalPrice = 0L;

        String orderId = "ORDER_" + java.util.UUID.randomUUID().toString().replace("-", "");

        // 7. 예약 객체 세이브
        ReservationEntity reservation = dto.toEntity(
                memberEntity,
                coupon,
                stay,
                orderId,
                originalPrice,
                discountAmount,
                totalPrice
        );

        reservationRepository.save(reservation);

        // 8. 파일 처리 루프 (기존과 동일)
        if (fileList != null && !fileList.isEmpty()) {
            for (MultipartFile file : fileList) {
                String s3Key = s3Service.upload(file, "reservation");
                reserveFileRepository.save(ReserveFileEntity.from(reservation, file, s3Key));
            }
        }

        // 💡 [핵심] 컨트롤러에 레포지토리를 주입하지 않고 여기서 필요한 데이터를 감싸서 던져줍니다.
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("reservationId", reservation.getId());
        resultMap.put("totalPrice", reservation.getTotalPrice());

        return resultMap;
    }
    /**
     * 💡 [추가] 특정 숙소의 이미 예약 완료된 날짜 범위 목록 조회
     */
    @Transactional(readOnly = true)
    public List<Map<String, String>> getBookedDates(Long stayId) {
        List<ReservationEntity> bookedReservations = reservationRepository.findFullyBookedDates(stayId);

        return bookedReservations.stream().map(res -> {
            Map<String, String> range = new java.util.HashMap<>();
            range.put("checkin", res.getCheckinDate().toString());
            range.put("checkout", res.getCheckoutDate().toString());
            return range;
        }).collect(java.util.stream.Collectors.toList());
    }


    /**
     * 💡 내 예약 목록 조회 (결제 완료 이후 건만 노출)
     */
    public List<ReservationResDto> getMyReservations(String username) {
        return reservationRepository
                .findByMember_UsernameOrderByIdDesc(username)
                .stream()
                .filter(reservation -> reservation.getStatus() != ReservationStatus.PENDING)
                .map(ReservationResDto::from)
                .toList();
    }

    /**
     * 💡 예약 단건 상세 조회 (PENDING 상태 접근 차단)
     */
    public ReservationDetailResDto getReservationDetail(Long id) {

        // 1. 예약 데이터 기본 조회
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("해당 예약 정보가 존재하지 않습니다."));

        if (reservation.getStatus() == ReservationStatus.PENDING) {
            throw new IllegalStateException("결제가 완료되지 않은 예약 내역입니다.");
        }

        // 2. 예약 연동 숙소 엔티티 추출
        StayEntity stayEntity = reservation.getStay();
        if (stayEntity == null) {
            throw new EntityNotFoundException("연결된 숙소 상품 정보가 없습니다.");
        }
        com.kh.app.product.space.entity.SpaceEntity spaceEntity = stayEntity.getSpace();

        List<com.kh.app.product.stay.entity.StayOptionEntity> optionEntities = stayOptionRepository.findByStay(stayEntity);
        List<com.kh.app.product.stay.entity.StayPictureEntity> pictures = stayPictureRepository.findByStayOrderBySortOrder(stayEntity);

        List<com.kh.app.product.stay.entity.StayOption> options = optionEntities.stream()
                .map(com.kh.app.product.stay.entity.StayOptionEntity::getStayOption)
                .toList();

        StayResDto stayResDto = StayResDto.from(stayEntity, options, pictures);

        // 4. Space 전용 정보 바인딩
        String spaceThumbnail = (pictures != null && !pictures.isEmpty()) ? pictures.get(0).getFilePath() : null;
        SpaceResDto spaceResDto = SpaceResDto.from(spaceEntity, List.of(stayResDto), spaceThumbnail);

        // 5. 결제 원장 연동 조회
        PaymentEntity paymentEntity = paymentRepository.findByReservation(reservation).orElse(null);

        // 💡 추가: 5-2. 예약 첨부파일 데이터 연동 조회
        List<ReserveFileEntity> reserveFiles = reserveFileRepository.findByReservationEntity(reservation);

        // 6. 최종 번들링 리턴 (reserveFiles와 s3Service 파라미터 추가)
        return ReservationDetailResDto.of(reservation, spaceResDto, stayResDto, paymentEntity, reserveFiles, s3Service);
    }

    /**
     * 💡 예약 정보 수정 (결제 완료 상태에서만 허용)
     */
    @Transactional
    public void update(Long id, ReservationUpdateReqDto dto) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("예약 내역을 찾을 수 없습니다. (ID: " + id + ")"));

        // 엔티티 내부의 상태 검증(PAYMENT_COMPLETED 인지 확인) 및 3개 필드 수정 실행
        reservation.update(dto);
    }

    /**
     * 💡 관리자용 예약 목록 페이징 조회
     */
    public Page<ReservationAdminListResDto> getAdminReservationList(
            int pno, String username, String guestName, Long reservationId, String sellerUsername
    ) {
        PageRequest pageRequest = PageRequest.of(pno, 10);
        // 💡 내부 RepositoryImpl에서 findAdminReservationList가 작동할 때
        // 리스트 안의 stream().map(ReservationAdminListResDto::from)을 거치며 stayName과 spaceName이 주입됩니다.
        return reservationRepository.findAdminReservationList(pageRequest, username, guestName, reservationId, sellerUsername);
    }

    /**
     * 💡 [금액 정산 헬퍼] 숙소 요일별 단가 정책 기반 원가 산출 알고리즘
     */
    private long calculateOriginalPrice(StayEntity stay, LocalDate checkin, LocalDate checkout) {
        long sumPrice = 0;
        LocalDate current = checkin;

        // 체크아웃 당일은 숙박비 산정에서 제외되므로 checkout 전날까지만 일수를 증가하며 요금을 더합니다.
        while (current.isBefore(checkout)) {
            DayOfWeek dayOfWeek = current.getDayOfWeek();

            switch (dayOfWeek) {
                case MONDAY -> sumPrice += stay.getMonPrice();
                case TUESDAY -> sumPrice += stay.getTuePrice();
                case WEDNESDAY -> sumPrice += stay.getWedPrice();
                case THURSDAY -> sumPrice += stay.getThuPrice();
                case FRIDAY -> sumPrice += stay.getFriPrice();
                case SATURDAY -> sumPrice += stay.getSatPrice();
                case SUNDAY -> sumPrice += stay.getSunPrice();
            }
            current = current.plusDays(1);
        }
        return sumPrice;
    }

    /**
     * 💡 관리자 전용 예약 단건 상세 조회 (PENDING 상태도 조회 가능)
     */
    public ReservationDetailResDto getAdminReservationDetail(Long id) {
        // 1. 예약 데이터 기본 조회 (관리자 전용 레포지토리 메서드 활용 가능)
        ReservationEntity reservation = reservationRepository.findAdminOneById(id)
                .orElseThrow(() -> new EntityNotFoundException("해당 예약 정보가 존재하지 않습니다. (ID: " + id + ")"));

        // 💡 관리자는 PENDING(결제대기) 상태여도 상세 정보를 볼 수 있어야 하므로 유저와 달리 상태 체크 통과

        return bundleReservationDetail(reservation);
    }

    /**
     * 💡 판매자(Seller) 전용 예약 목록 조회
     */
    /**
     * 💡 판매자(Seller) 전용 예약 목록 조회 (동적 다중 검색 기능 탑재)
     */
    public Page<ReservationAdminListResDto> getSellerReservationList(
            int pno, String sellerUsername, Long reservationId, String guestName, LocalDate checkinDate, ReservationStatus status
    ) {
        PageRequest pageRequest = PageRequest.of(pno, 10);
        return reservationRepository.findSellerReservationList(pageRequest, sellerUsername, reservationId, guestName, checkinDate, status);
    }

    /**
     * 💡 판매자(Seller) 전용 예약 단건 상세 조회 (소유권 검증 포함)
     */
    public ReservationDetailResDto getSellerReservationDetail(Long id, String sellerUsername) {
        // 1. 단건 조회
        ReservationEntity reservation = reservationRepository.findSellerOneById(id)
                .orElseThrow(() -> new EntityNotFoundException("해당 예약 내역이 존재하지 않습니다. (ID: " + id + ")"));

        // 2. 💡 [보안 검증] 해당 예약이 포함된 공간의 판매자 아이디와 로그인한 판매자 아이디 대조
        String realSellerName = reservation.getStay().getSpace().getSeller().getUsername();
        if (!realSellerName.equals(sellerUsername)) {
            throw new IllegalArgumentException("해당 예약 내역에 대한 접근 권한이 없습니다.");
        }

        return bundleReservationDetail(reservation);
    }
    private ReservationDetailResDto bundleReservationDetail(ReservationEntity reservation) {
        // 1. 예약 연동 숙소 엔티티 추출 및 검증
        StayEntity stayEntity = reservation.getStay();
        if (stayEntity == null) {
            throw new EntityNotFoundException("연결된 숙소 상품 정보가 없습니다.");
        }
        com.kh.app.product.space.entity.SpaceEntity spaceEntity = stayEntity.getSpace();

        // 2. 숙소 옵션 및 사진 정보 로드
        List<com.kh.app.product.stay.entity.StayOptionEntity> optionEntities = stayOptionRepository.findByStay(stayEntity);
        List<com.kh.app.product.stay.entity.StayPictureEntity> pictures = stayPictureRepository.findByStayOrderBySortOrder(stayEntity);

        List<com.kh.app.product.stay.entity.StayOption> options = optionEntities.stream()
                .map(com.kh.app.product.stay.entity.StayOptionEntity::getStayOption)
                .toList();

        StayResDto stayResDto = StayResDto.from(stayEntity, options, pictures);

        // 3. Space 정보 및 섬네일 바인딩
        String spaceThumbnail = null;
        if (pictures != null && !pictures.isEmpty()) {
            // 첫 번째 사진의 s3Key를 이용해 전체 URL 생성
            spaceThumbnail = s3Service.getFileUrl(pictures.get(0).getFilePath());
        }
        SpaceResDto spaceResDto = SpaceResDto.from(spaceEntity, List.of(stayResDto), spaceThumbnail);

        // 4. 결제 원장 조회
        PaymentEntity paymentEntity = paymentRepository.findByReservation(reservation).orElse(null);

        // 5. 예약 첨부파일 조회
        List<ReserveFileEntity> reserveFiles = reserveFileRepository.findByReservationEntity(reservation);

        // 6. 작성하신 팩토리 메서드로 통합 조립 후 리턴
        return ReservationDetailResDto.of(reservation, spaceResDto, stayResDto, paymentEntity, reserveFiles, s3Service);
    }

    @Transactional
    public void approveReservation(Long id, String sellerUsername) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("예약 건을 찾을 수 없습니다."));

        // 소유권 검증 (내 공간에 들어온 예약인지 확인)
        if (!reservation.getStay().getSpace().getSeller().getUsername().equals(sellerUsername)) {
            throw new IllegalArgumentException("해당 예약에 대한 승인 권한이 없습니다.");
        }

        reservation.approveBySeller(); // RESERVED 상태 전환

        // 구매자 예약이 확정되었다고 알림 전송 (선택 구현 가능)
        NotificationCreateReqDto notifyUser = NotificationCreateReqDto.builder()
                .memberId(reservation.getMember().getId())
                .type(NotificationType.RESERVATION_COMPLETE) // 적절한 유형 매핑
                .content("[" + reservation.getStay().getName() + "] 숙소 예약이 판매자에 의해 확정되었습니다!")
                .redirectUrl("/mypage/reservation")
                .referenceId(reservation.getId())
                .build();
        notificationService.createNotification(notifyUser);
    }

    @Transactional
    public void cancelReservationBySeller(Long id, String sellerUsername) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("예약 건을 찾을 수 없습니다."));

        // 소유권 검증
        if (!reservation.getStay().getSpace().getSeller().getUsername().equals(sellerUsername)) {
            throw new IllegalArgumentException("해당 예약에 대한 취소 권한이 없습니다.");
        }

        // 💡 [정책 반영] 판매자가 이미 승인 완료(RESERVED)를 누른 상태라면 취소 불가능하게 차단
        if (reservation.getStatus() == ReservationStatus.RESERVED) {
            throw new IllegalStateException("이미 승인 확정된 예약은 취소할 수 없습니다. 고객센터에 문의하세요.");
        }

        // 판매자 취소 상태 변이 (PAYMENT_COMPLETED 상태에서만 가능)
        reservation.cancelBySeller(); // SELLER_CANCELLED로 변경

        // 💡 [해결] 판매자가 승인 전에 거절했으므로 무조건 100% 자동 전액 환불 실행
        refundService.processFullRefundBySystem(reservation);
    }

    /**
     * 💡 구매자(또는 시스템 스케줄러) 전용: 이용 완료 확정 기능 (★정산 연동 시점)
     */
    @Transactional
    public void completeReservation(Long id, String username) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("예약 건을 찾을 수 없습니다."));

        if (!reservation.getMember().getUsername().equals(username)) {
            throw new IllegalArgumentException("본인의 예약만 이용 완료 처리를 할 수 있습니다.");
        }

        reservation.completeUsage(); // COMPLETED 상태 전환

        // 💡 [수정] 예약에 연동된 실제 결제(Payment) 엔티티를 가져옵니다.
        // 예약 상세 조회 시 사용하셨던 paymentRepository 조회를 활용합니다.
        com.kh.app.transaction.payment.entity.PaymentEntity payment = paymentRepository.findByReservation(reservation)
                .orElseThrow(() -> new EntityNotFoundException("연 연동된 결제 내역을 찾을 수 없습니다."));

        // 💡 결제 엔티티의 실제 PK ID를 파라미터로 전달하여 매출 원장을 꺼내옵니다.
        com.kh.app.transaction.sales.entity.SalesEntity sales = salesService.findByPaymentId(payment.getId());

        // 정산 대상 타겟 생성
        payoutService.createPayoutTarget(sales);
    }

    /**
     * 💡 구매자 전용: 변동 패널티 정책 적용 예약 취소 및 환불 연동
     */
    @Transactional
    public void cancelReservationByUser(Long id, String username) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("예약 내역을 찾을 수 없습니다."));

        if (!reservation.getMember().getUsername().equals(username)) {
            throw new IllegalArgumentException("본인의 예약만 취소할 수 있습니다.");
        }

        // 이미 취소되었거나 이용 완료된 건인지 검증
        if (reservation.getStatus() == ReservationStatus.USER_CANCELLED ||
                reservation.getStatus() == ReservationStatus.COMPLETED ||
                reservation.getStatus() == ReservationStatus.REFUND_COMPLETED) {
            throw new IllegalStateException("취소 가능한 상태의 예약이 아닙니다.");
        }

        // 1. 환불 정책 비율 계산기 호출 (100%, 50%, 0%)
        int refundRate = refundService.calculateRefundRate(reservation);

        if (refundRate == 0) {
            throw new IllegalStateException("본 예약 건은 환불 정책상 취소가 불가능한 기간(또는 노쇼)에 진입했습니다.");
        }

        // 2. 최종 환불 금액 계산
        long originalTotalPrice = reservation.getTotalPrice();
        long finalRefundAmount = (originalTotalPrice * refundRate) / 100;

        // 3. 예약 상태 변이 (환불 완료 또는 유저 취소 상태 매핑)
        // 환불이 전액 혹은 부분이라도 진행되므로 REFUND_COMPLETED 또는 USER_CANCELLED 지정
        reservation.updateStatus(ReservationStatus.USER_CANCELLED);

        // 4. [해결] 환불 서비스 트리거 가동 (새로 만든 헬퍼 메서드 호출)
        refundService.processTossCancelByRate(reservation, finalRefundAmount, "구매자 변동 패널티 취소");

        // 5. [해결] 예약에 연동된 실제 결제 원장(Payment)을 추적하여 결제 PK ID 추출
        com.kh.app.transaction.payment.entity.PaymentEntity payment = paymentRepository.findByReservation(reservation)
                .orElseThrow(() -> new EntityNotFoundException("연동된 결제 내역을 찾을 수 없습니다."));

        // 6. 매출 원장 차감 반영 (예약 ID가 아닌 결제 ID를 전달하여 컴파일 에러 해결!)
        salesService.handleCancel(payment.getId(), finalRefundAmount);

        log.info("▶️ [취소 완료] 구매자 취소 완료: 환불율 {}% / 총 환불금액: {}원", refundRate, finalRefundAmount);
    }
}