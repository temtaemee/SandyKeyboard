package com.kh.app.transaction.reservation.repository;

import com.kh.app.transaction.reservation.dto.response.ReservationAdminListResDto;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Optional;

public interface ReservationRepositoryCustom {


    Optional<ReservationEntity> getOneById(Long id);

    Page<ReservationAdminListResDto> findAdminReservationList(PageRequest pageRequest);
}