package com.kh.app.transaction.reservation.repository;

import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReserveFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReserveFileRepository extends JpaRepository<ReserveFileEntity, Long> {




    List<ReserveFileEntity> findByReservationEntity_Id(Long reservationId);
}