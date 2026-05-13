package com.kh.app.transaction.reservation.repository;

import com.kh.app.transaction.reservation.entity.ReservationEntity;

import java.util.Optional;

public interface ReservationRepositoryCustom {


    Optional<ReservationEntity> getOneById(Long id);
}