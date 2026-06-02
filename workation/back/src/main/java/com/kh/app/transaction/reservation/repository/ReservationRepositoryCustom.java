package com.kh.app.transaction.reservation.repository;

import com.kh.app.transaction.reservation.dto.response.ReservationAdminListResDto;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Optional;

public interface ReservationRepositoryCustom {


    Optional<ReservationEntity> getOneById(Long id);

    Page<ReservationAdminListResDto> findAdminReservationList(
            PageRequest pageRequest,
            String username,
            String guestName,
            Long reservationId,
            String sellerUsername // 💡 파라미터 추가 맞춤
    );

    Optional<ReservationEntity> findAdminOneById(Long id);

    Page<ReservationAdminListResDto> findSellerReservationList(
            Pageable pageable,
            String sellerUsername,
            Long reservationId,
            String guestName,
            LocalDate checkinDate,
            ReservationStatus status // 💡 추가
    );

    Optional<ReservationEntity> findSellerOneById(Long id);
}