package com.kh.app.transaction.reservation.repository;

import com.kh.app.transaction.reservation.entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long>, ReservationRepositoryCustom {
}