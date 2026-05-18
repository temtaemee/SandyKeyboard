package com.kh.app.transaction.reservation.scheduler;

import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import com.kh.app.transaction.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReservationScheduler {

    private final ReservationRepository reservationRepository;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expirePendingReservations() {

        LocalDateTime expiredTime =
                LocalDateTime.now().minusMinutes(30);

        List<ReservationEntity> expiredReservations =
                reservationRepository
                        .findByStatusAndCreatedAtBefore(
                                ReservationStatus.PENDING,
                                expiredTime
                        );

        for (ReservationEntity reservation : expiredReservations) {

            reservation.expire();

            log.info(
                    "예약 자동 만료 처리 완료 : reservationId={}",
                    reservation.getId()
            );
        }
    }
}