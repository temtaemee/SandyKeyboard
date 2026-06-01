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



}