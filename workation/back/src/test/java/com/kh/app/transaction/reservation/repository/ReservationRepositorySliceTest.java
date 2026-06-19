package com.kh.app.transaction.reservation.repository;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.product.space.entity.Area;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.space.repository.SpaceRepository;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.repository.StayRepository;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

import org.springframework.context.annotation.Import;
import com.kh.app.transaction.reservation.config.QuerydslConfig;

@DataJpaTest(properties = {
        "app.seed.enabled=false",
        "spring.jpa.hibernate.ddl-auto=update",
        "spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect"
})
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(QuerydslConfig.class)
class ReservationRepositorySliceTest {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private StayRepository stayRepository;

    @Autowired
    private SpaceRepository spaceRepository;

    @Test
    void countDuplicateReservationsAndConflictsTest() {
        // 1. MemberEntity (Seller & Guest) 생성 및 저장
        MemberEntity seller = MemberEntity.builder()
                .username("seller-test-username")
                .password("password")
                .createdAt(LocalDateTime.now())
                .banYn("N")
                .build();
        memberRepository.save(seller);

        MemberEntity guest = MemberEntity.builder()
                .username("guest-test-username")
                .password("password")
                .createdAt(LocalDateTime.now())
                .banYn("N")
                .build();
        memberRepository.save(guest);

        // 2. SpaceEntity 생성 및 저장
        SpaceEntity space = SpaceEntity.builder()
                .name("Test Workspace Space")
                .phone("010-1234-5678")
                .email("test@workspace.com")
                .summary("Nice workspace summary")
                .description("Detailed workspace description")
                .address1("Seoul, Mapo-gu")
                .area(Area.SEOUL)
                .seller(seller)
                .visibleYn("Y")
                .build();
        spaceRepository.save(space);

        // 3. StayEntity 생성 및 저장
        StayEntity stay = StayEntity.builder()
                .space(space)
                .name("Cozy Desk Stay")
                .summary("Cozy desk stay summary")
                .description("Cozy desk stay description")
                .capacity(2)
                .maxCapa(4)
                .workationYn("Y")
                .checkInTime(LocalTime.of(15, 0))
                .checkOutTime(LocalTime.of(11, 0))
                .visibleYn("Y")
                .build();
        stayRepository.save(stay);

        // 4. 기존 예약 저장 (기간: 2026-07-10 ~ 2026-07-15, 상태: PAYMENT_COMPLETED)
        ReservationEntity reservation = ReservationEntity.builder()
                .member(guest)
                .stay(stay)
                .space(space)
                .checkinDate(LocalDate.of(2026, 7, 10))
                .checkoutDate(LocalDate.of(2026, 7, 15))
                .guestCount(2)
                .primaryGuestName("John Doe")
                .primaryGuestPhone("01011112222")
                .primaryGuestEmail("john@example.com")
                .originalPrice(50000L)
                .totalPrice(50000L)
                .createdAt(LocalDateTime.now())
                .status(ReservationStatus.PAYMENT_COMPLETED)
                .build();
        reservationRepository.save(reservation);

        // 5. 겹치는 기간 예약 중복 체크 검증 (2026-07-14 ~ 2026-07-18) -> 겹침!
        long dupCount = reservationRepository.countDuplicateReservations(
                stay.getId(),
                LocalDate.of(2026, 7, 14),
                LocalDate.of(2026, 7, 18)
        );
        assertThat(dupCount).isEqualTo(1L);

        // 6. 안 겹치는 기간 예약 중복 체크 검증 (2026-07-15 ~ 2026-07-20) -> 안 겹침! (15일 체크아웃/체크인 교차)
        long noDupCount = reservationRepository.countDuplicateReservations(
                stay.getId(),
                LocalDate.of(2026, 7, 15),
                LocalDate.of(2026, 7, 20)
        );
        assertThat(noDupCount).isEqualTo(0L);

        // 7. Conflicting 예약 목록 조회 검증
        List<ReservationEntity> conflicts = reservationRepository.findConflictReservations(
                stay.getId(),
                LocalDate.of(2026, 7, 12),
                LocalDate.of(2026, 7, 14)
        );
        assertThat(conflicts).hasSize(1);
        assertThat(conflicts.get(0).getId()).isEqualTo(reservation.getId());
    }
}
