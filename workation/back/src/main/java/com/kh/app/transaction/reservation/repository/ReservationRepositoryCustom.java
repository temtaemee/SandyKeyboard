package com.kh.app.transaction.reservation.repository;

import com.kh.app.transaction.reservation.dto.response.ReservationAdminListResDto;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

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
}