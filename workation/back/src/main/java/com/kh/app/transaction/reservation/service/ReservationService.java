package com.kh.app.transaction.reservation.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.middle.coupon.entity.MemberCouponEntity;
import com.kh.app.middle.coupon.repository.MemberCouponRepository;
import com.kh.app.notification.dto.request.NotificationCreateReqDto;
import com.kh.app.notification.entity.NotificationType;
import com.kh.app.notification.service.NotificationService;
import com.kh.app.product.space.dto.response.SpaceResDto;
import com.kh.app.product.space.repository.SpacePictureRepository;
import com.kh.app.product.stay.dto.response.StayResDto;
import com.kh.app.product.stay.entity.StayEntity;
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
    private final SpacePictureRepository spacePictureRepository;

    @Transactional
    public Map<String, Object> create(String username, Long stayId, ReservationCreateReqDto dto, List<MultipartFile> fileList) throws IOException {
        // 1. 중복 검사
        long duplicateCount = reservationRepository.countDuplicateReservations(stayId, dto.getCheckinDate(), dto.getCheckoutDate());

        if (duplicateCount > 0) {
            // 💡 충돌 예약 건 조회
            List<ReservationEntity> conflicts = reservationRepository.findConflictReservations(stayId, dto.getCheckinDate(), dto.getCheckoutDate());

            // 💡 상세 로그 출력
            for (ReservationEntity res : conflicts) {
                log.error("▶️ 중복 예약 발견! 신규 요청: {} ~ {}, 기존 예약 ID: {}, 기간: {} ~ {}",
                        dto.getCheckinDate(), dto.getCheckoutDate(), res.getId(), res.getCheckinDate(), res.getCheckoutDate());
                log.error("▶️ 중복 예약 발견! [ID: {}, 상태: {}, 기간: {} ~ {}]",
                        res.getId(), res.getStatus(), res.getCheckinDate(), res.getCheckoutDate());
            }

            throw new IllegalStateException("선택하신 기간은 이미 다른 회원의 예약이 완료된 일정입니다.");
        }

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

        long originalPrice = calculateOriginalPrice(stay, dto.getCheckinDate(), dto.getCheckoutDate());
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


            discountAmount = (originalPrice * coupon.getDiscountRate()) / 100;
            if (discountAmount > originalPrice) discountAmount = originalPrice;
        }

        long totalPrice = originalPrice - discountAmount;
        if (totalPrice < 0) totalPrice = 0L;

        String orderId = "ORDER_" + java.util.UUID.randomUUID().toString().replace("-", "");

        ReservationEntity reservation = dto.toEntity(memberEntity, coupon, stay, orderId, originalPrice, discountAmount, totalPrice);
        reservationRepository.save(reservation);

        if (fileList != null && !fileList.isEmpty()) {
            for (MultipartFile file : fileList) {
                String s3Key = s3Service.upload(file, "reservation");
                reserveFileRepository.save(ReserveFileEntity.from(reservation, file, s3Key));
            }
        }

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("reservationId", reservation.getId());
        resultMap.put("totalPrice", reservation.getTotalPrice());

        return resultMap;
    }

    @Transactional(readOnly = true)
    public List<Map<String, String>> getBookedDates(Long stayId) {
        return reservationRepository.findFullyBookedDates(stayId).stream().map(res -> {
            Map<String, String> range = new HashMap<>();
            range.put("checkin", res.getCheckinDate().toString());
            range.put("checkout", res.getCheckoutDate().toString());
            return range;
        }).toList();
    }

    public List<ReservationResDto> getMyReservations(String username) {
        return reservationRepository.findByMember_UsernameOrderByIdDesc(username)
                .stream()
                .filter(reservation -> reservation.getStatus() != ReservationStatus.PENDING)
                .map(reservation -> {
                    StayEntity stay = reservation.getStay();
                    String imageUrl = null;

                    if (stay != null && stay.getSpace() != null) {
                        imageUrl = spacePictureRepository.findBySpaceIdAndMainYn(stay.getSpace().getId(), "Y")
                                .map(p -> p.getFilePath().startsWith("http") ? p.getFilePath() : s3Service.getFileUrl(p.getFilePath()))
                                .orElse(null);
                    }
                    return ReservationResDto.from(reservation, imageUrl);
                })
                .toList();
    }

    public ReservationDetailResDto getReservationDetail(Long id) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("해당 예약 정보가 존재하지 않습니다."));

        if (reservation.getStatus() == ReservationStatus.PENDING) {
            throw new IllegalStateException("결제가 완료되지 않은 예약 내역입니다.");
        }
        return bundleReservationDetail(reservation);
    }

    @Transactional
    public void update(Long id, ReservationUpdateReqDto dto) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("예약 내역을 찾을 수 없습니다."));
        reservation.update(dto);
    }

    public Page<ReservationAdminListResDto> getAdminReservationList(int pno, String username, String guestName, Long reservationId, String sellerUsername) {
        return reservationRepository.findAdminReservationList(PageRequest.of(pno, 10), username, guestName, reservationId, sellerUsername);
    }

    private long calculateOriginalPrice(StayEntity stay, LocalDate checkin, LocalDate checkout) {
        long sumPrice = 0;
        LocalDate current = checkin;
        while (current.isBefore(checkout)) {
            DayOfWeek dow = current.getDayOfWeek();
            sumPrice += switch (dow) {
                case MONDAY -> stay.getMonPrice();
                case TUESDAY -> stay.getTuePrice();
                case WEDNESDAY -> stay.getWedPrice();
                case THURSDAY -> stay.getThuPrice();
                case FRIDAY -> stay.getFriPrice();
                case SATURDAY -> stay.getSatPrice();
                case SUNDAY -> stay.getSunPrice();
            };
            current = current.plusDays(1);
        }
        return sumPrice;
    }

    public ReservationDetailResDto getAdminReservationDetail(Long id) {
        ReservationEntity reservation = reservationRepository.findAdminOneById(id)
                .orElseThrow(() -> new EntityNotFoundException("해당 예약 정보가 존재하지 않습니다."));
        return bundleReservationDetail(reservation);
    }

    public Page<ReservationAdminListResDto> getSellerReservationList(int pno, String sellerUsername, Long reservationId, String guestName, LocalDate checkinDate, ReservationStatus status) {
        return reservationRepository.findSellerReservationList(PageRequest.of(pno, 10), sellerUsername, reservationId, guestName, checkinDate, status);
    }

    public ReservationDetailResDto getSellerReservationDetail(Long id, String sellerUsername) {
        ReservationEntity reservation = reservationRepository.findSellerOneById(id)
                .orElseThrow(() -> new EntityNotFoundException("해당 예약 내역이 존재하지 않습니다."));

        if (!reservation.getStay().getSpace().getSeller().getUsername().equals(sellerUsername)) {
            throw new IllegalArgumentException("해당 예약 내역에 대한 접근 권한이 없습니다.");
        }
        return bundleReservationDetail(reservation);
    }

    private ReservationDetailResDto bundleReservationDetail(ReservationEntity reservation) {
        // 1. 예약 연동 숙소 및 공간 추출
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

        // 3. [수정] 썸네일을 숙소 사진(StayPicture)의 첫 번째로 설정
        String stayThumbnail = (pictures != null && !pictures.isEmpty())
                ? s3Service.getFileUrl(pictures.get(0).getFilePath())
                : null;

        // 4. SpaceResDto 생성 (썸네일 인자 변경)
        SpaceResDto spaceResDto = SpaceResDto.from(spaceEntity, List.of(stayResDto), stayThumbnail);

        // 5. 결제 및 파일 정보 로드
        PaymentEntity paymentEntity = paymentRepository.findByReservation(reservation).orElse(null);
        List<ReserveFileEntity> reserveFiles = reserveFileRepository.findByReservationEntity(reservation);

        return ReservationDetailResDto.of(reservation, spaceResDto, stayResDto, paymentEntity, reserveFiles, s3Service);
    }

    @Transactional
    public void approveReservation(Long id, String sellerUsername) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("예약 건을 찾을 수 없습니다."));

        if (!reservation.getStay().getSpace().getSeller().getUsername().equals(sellerUsername)) {
            throw new IllegalArgumentException("해당 예약에 대한 승인 권한이 없습니다.");
        }
        reservation.approveBySeller();
        notificationService.createNotification(NotificationCreateReqDto.builder()
                .memberId(reservation.getMember().getId())
                .type(NotificationType.RESERVATION_COMPLETE)
                .content("[" + reservation.getStay().getName() + "] 숙소 예약이 확정되었습니다!")
                .redirectUrl("/mypage/reservation")
                .referenceId(reservation.getId())
                .build());
    }

    @Transactional
    public void cancelReservationBySeller(Long id, String sellerUsername) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("예약 건을 찾을 수 없습니다."));

        if (!reservation.getStay().getSpace().getSeller().getUsername().equals(sellerUsername)) {
            throw new IllegalArgumentException("해당 예약에 대한 취소 권한이 없습니다.");
        }
        if (reservation.getStatus() == ReservationStatus.RESERVED) {
            throw new IllegalStateException("이미 승인 확정된 예약은 취소할 수 없습니다.");
        }
        reservation.cancelBySeller();
        refundService.processFullRefundBySystem(reservation);

        // 쿠폰원복
        // 해당 예약에 연결된 쿠폰이 맞는지 확인하고 MemberCouponEntity를 가져옵니다.
        // (ReservationEntity에 member와 coupon이 있으므로 가능)
        MemberCouponEntity memberCoupon = memberCouponRepository
                .findByMemberAndCouponId(reservation.getMember(), reservation.getCoupon())
                .orElseThrow(() -> new EntityNotFoundException("사용자의 쿠폰 내역을 찾을 수 없습니다."));
        reservation.getCoupon().restoreQty(); // 쿠폰 수량 복구
        memberCoupon.restoreCoupon(); // 쿠폰 원복

    }

    @Transactional
    public void completeReservation(Long id, String username) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("예약 건을 찾을 수 없습니다."));

        if (!reservation.getMember().getUsername().equals(username)) {
            throw new IllegalArgumentException("본인의 예약만 이용 완료 처리를 할 수 있습니다.");
        }
        reservation.completeUsage();
        PaymentEntity payment = paymentRepository.findByReservation(reservation)
                .orElseThrow(() -> new EntityNotFoundException("결제 내역을 찾을 수 없습니다."));
        payoutService.createPayoutTarget(salesService.findByPaymentId(payment.getId()));
    }


}