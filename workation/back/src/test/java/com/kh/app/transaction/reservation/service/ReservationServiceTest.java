package com.kh.app.transaction.reservation.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.middle.coupon.repository.MemberCouponRepository;
import com.kh.app.notification.service.NotificationService;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.space.repository.SpacePictureRepository;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.repository.StayOptionRepository;
import com.kh.app.product.stay.repository.StayPictureRepository;
import com.kh.app.product.stay.repository.StayRepository;
import com.kh.app.transaction.payment.repository.PaymentRepository;
import com.kh.app.transaction.payout.service.PayoutService;
import com.kh.app.transaction.refund.service.RefundService;
import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import com.kh.app.transaction.reservation.repository.ReservationRepository;
import com.kh.app.transaction.reservation.repository.ReserveFileRepository;
import com.kh.app.transaction.sales.service.SalesService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private ReserveFileRepository reserveFileRepository;
    @Mock
    private MemberRepository memberRepository;
    @Mock
    private S3Service s3Service;
    @Mock
    private StayRepository stayRepository;
    @Mock
    private MemberCouponRepository memberCouponRepository;
    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private StayPictureRepository stayPictureRepository;
    @Mock
    private StayOptionRepository stayOptionRepository;
    @Mock
    private NotificationService notificationService;
    @Mock
    private SalesService salesService;
    @Mock
    private PayoutService payoutService;
    @Mock
    private RefundService refundService;
    @Mock
    private SpacePictureRepository spacePictureRepository;

    @InjectMocks
    private ReservationService reservationService;

    @Test
    void createReservationFailsWhenDuplicateExists() {
        ReservationCreateReqDto dto = new ReservationCreateReqDto();
        dto.setCheckinDate(LocalDate.of(2026, 7, 10));
        dto.setCheckoutDate(LocalDate.of(2026, 7, 15));

        when(reservationRepository.countDuplicateReservations(1L, dto.getCheckinDate(), dto.getCheckoutDate()))
                .thenReturn(1L);

        assertThatThrownBy(() -> reservationService.create("guest1", 1L, dto, null))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("이미 다른 회원의 예약이 완료된 일정");
    }

    @Test
    void createReservationFailsWhenDatesAreInvalid() {
        ReservationCreateReqDto dto = new ReservationCreateReqDto();
        dto.setCheckinDate(LocalDate.of(2026, 7, 15));
        dto.setCheckoutDate(LocalDate.of(2026, 7, 10)); // check-in after check-out

        MemberEntity guest = MemberEntity.builder().username("guest1").build();

        when(reservationRepository.countDuplicateReservations(1L, dto.getCheckinDate(), dto.getCheckoutDate()))
                .thenReturn(0L);
        when(memberRepository.findByUsername("guest1")).thenReturn(Optional.of(guest));

        assertThatThrownBy(() -> reservationService.create("guest1", 1L, dto, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("체크인 날짜는 체크아웃 날짜보다 앞서야");
    }

    @Test
    void createReservationFailsWhenGuestCountExceedsMaxCapacity() {
        ReservationCreateReqDto dto = new ReservationCreateReqDto();
        dto.setCheckinDate(LocalDate.of(2026, 7, 10));
        dto.setCheckoutDate(LocalDate.of(2026, 7, 15));
        dto.setGuestCount(5); // 5 guests

        MemberEntity guest = MemberEntity.builder().username("guest1").build();
        StayEntity stay = StayEntity.builder()
                .id(1L)
                .maxCapa(3) // max 3 guests
                .build();

        when(reservationRepository.countDuplicateReservations(1L, dto.getCheckinDate(), dto.getCheckoutDate()))
                .thenReturn(0L);
        when(memberRepository.findByUsername("guest1")).thenReturn(Optional.of(guest));
        when(stayRepository.findById(1L)).thenReturn(Optional.of(stay));

        assertThatThrownBy(() -> reservationService.create("guest1", 1L, dto, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("숙소 최대 수용 인원을 초과");
    }

    @Test
    void approveReservationSuccess() {
        Long reservationId = 10L;
        String sellerUsername = "seller1";

        MemberEntity seller = MemberEntity.builder().username(sellerUsername).build();
        SpaceEntity space = SpaceEntity.builder().seller(seller).build();
        StayEntity stay = StayEntity.builder().space(space).name("Mock Stay").build();
        MemberEntity guest = MemberEntity.builder().id(5L).username("guest1").build();

        ReservationEntity reservation = spy(ReservationEntity.builder()
                .id(reservationId)
                .status(ReservationStatus.PAYMENT_COMPLETED)
                .stay(stay)
                .member(guest)
                .build());

        when(reservationRepository.findById(reservationId)).thenReturn(Optional.of(reservation));

        reservationService.approveReservation(reservationId, sellerUsername);

        verify(reservation, times(1)).approveBySeller();
        verify(notificationService, times(1)).createNotification(any());
    }

    @Test
    void approveReservationFailsForNonSeller() {
        Long reservationId = 10L;

        MemberEntity realSeller = MemberEntity.builder().username("seller1").build();
        SpaceEntity space = SpaceEntity.builder().seller(realSeller).build();
        StayEntity stay = StayEntity.builder().space(space).build();

        ReservationEntity reservation = ReservationEntity.builder()
                .id(reservationId)
                .status(ReservationStatus.PAYMENT_COMPLETED)
                .stay(stay)
                .build();

        when(reservationRepository.findById(reservationId)).thenReturn(Optional.of(reservation));

        assertThatThrownBy(() -> reservationService.approveReservation(reservationId, "intruder-seller"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("해당 예약에 대한 승인 권한이 없습니다");
    }
}
