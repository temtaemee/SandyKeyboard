package com.kh.app.transaction.reservation.repository;

import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReserveFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReserveFileRepository extends JpaRepository<ReserveFileEntity, Long> {
    // 예약 객체로 연관된 첨부파일 전체 조회
    List<ReserveFileEntity> findByReservationEntity(ReservationEntity reservationEntity);
}