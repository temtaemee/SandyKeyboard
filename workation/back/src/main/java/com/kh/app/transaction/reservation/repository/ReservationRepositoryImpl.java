package com.kh.app.transaction.reservation.repository;

import com.kh.app.transaction.reservation.entity.QReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@RequiredArgsConstructor
public class ReservationRepositoryImpl implements ReservationRepositoryCustom {

    private final JPAQueryFactory qf;

    @Override
    public Optional<ReservationEntity> getOneById(Long id) {

        QReservationEntity reservation = QReservationEntity.reservationEntity;

        ReservationEntity result = qf
                .selectFrom(reservation)
                .where(reservation.id.eq(id))
                .fetchOne();

        return Optional.ofNullable(result);
    }
}