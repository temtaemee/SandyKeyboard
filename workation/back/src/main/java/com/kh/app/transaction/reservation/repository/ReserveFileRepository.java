package com.kh.app.transaction.reservation.repository;

import com.kh.app.transaction.reservation.entity.ReserveFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReserveFileRepository extends JpaRepository<ReserveFileEntity, Long> {

    List<ReserveFileEntity> findByReservationEntityId(Long reservationId);
}