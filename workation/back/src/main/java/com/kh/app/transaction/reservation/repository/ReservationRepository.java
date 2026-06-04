package com.kh.app.transaction.reservation.repository;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long>, ReservationRepositoryCustom {
    Page<ReservationEntity> findByMemberOrderByIdDesc(
            MemberEntity member,
            Pageable pageable
    );

    Optional<ReservationEntity> findByIdAndMember(
            Long id,
            MemberEntity member
    );

    List<ReservationEntity> findByMember_UsernameOrderByIdDesc(String username);

    Optional<ReservationEntity> findByOrderId(String orderId);

    //  지정된 기간 내에 체크인 날짜가 있으면서 상태가 RESERVED 또는 COMPLETED인 예약 건수 카운트
    @Query("SELECT COUNT(r) FROM ReservationEntity r " +
            "WHERE r.checkinDate >= :start AND r.checkinDate <= :end " +
            "AND (r.status = 'RESERVED' OR r.status = 'COMPLETED')")
    long countValidReservationsByCheckinDate(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    @Query("SELECT COUNT(r) FROM ReservationEntity r " +
            "WHERE r.stay.id = :stayId " +
            "AND r.checkinDate < :checkoutDate " +
            // 💡 중요: 체크아웃 날짜가 체크인 날짜보다 '커야만(>) 겹치는 것'입니다.
            // 같으면(=) 겹치지 않는 것으로 간주합니다.
            "AND r.checkoutDate > :checkinDate " +
            "AND r.status IN (com.kh.app.transaction.reservation.entity.ReservationStatus.PAYMENT_COMPLETED, " +
            "                 com.kh.app.transaction.reservation.entity.ReservationStatus.RESERVED, " +
            "                 com.kh.app.transaction.reservation.entity.ReservationStatus.COMPLETED)")
    long countDuplicateReservations(
            @Param("stayId") Long stayId,
            @Param("checkinDate") LocalDate checkinDate,
            @Param("checkoutDate") LocalDate checkoutDate
    );

    // 💡 2. 프론트엔드 달력에 '이미 예약된 날짜 목록'을 전달하기 위한 조회 쿼리
    @Query("SELECT r FROM ReservationEntity r " +
            "WHERE r.stay.id = :stayId " +
            "AND r.status IN (com.kh.app.transaction.reservation.entity.ReservationStatus.PAYMENT_COMPLETED, " +
            "                 com.kh.app.transaction.reservation.entity.ReservationStatus.RESERVED, " +
            "                 com.kh.app.transaction.reservation.entity.ReservationStatus.COMPLETED)")
    List<ReservationEntity> findFullyBookedDates(@Param("stayId") Long stayId);


    @Query("SELECT r FROM ReservationEntity r " +
            "WHERE r.stay.id = :stayId " +
            "AND r.checkinDate < :checkoutDate " +
            "AND r.checkoutDate > :checkinDate " +
            "AND r.status IN (com.kh.app.transaction.reservation.entity.ReservationStatus.PAYMENT_COMPLETED, " +
            "                 com.kh.app.transaction.reservation.entity.ReservationStatus.RESERVED, " +
            "                 com.kh.app.transaction.reservation.entity.ReservationStatus.COMPLETED)")
    List<ReservationEntity> findConflictReservations(
            @Param("stayId") Long stayId,
            @Param("checkinDate") LocalDate checkinDate,
            @Param("checkoutDate") LocalDate checkoutDate
    );

}