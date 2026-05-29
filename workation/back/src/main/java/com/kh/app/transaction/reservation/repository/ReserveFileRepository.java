package com.kh.app.transaction.reservation.repository;

import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReserveFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReserveFileRepository extends JpaRepository<ReserveFileEntity, Long> {
    // 엔티ti의 변수명이 reservationEntity 이므로 규칙을 명확히 맞춥니다.
    List<ReserveFileEntity> findByReservationEntity(ReservationEntity reservationEntity);
}