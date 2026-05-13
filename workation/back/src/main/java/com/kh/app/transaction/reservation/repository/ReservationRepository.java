package com.kh.app.transaction.reservation.repository;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.nio.channels.FileChannel;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long>, ReservationRepositoryCustom {
    Page<ReservationEntity> findByMember(
            MemberEntity member,
            Pageable pageable
    );
}