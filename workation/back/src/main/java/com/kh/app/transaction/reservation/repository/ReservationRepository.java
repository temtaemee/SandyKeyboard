package com.kh.app.transaction.reservation.repository;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.nio.channels.FileChannel;
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

}