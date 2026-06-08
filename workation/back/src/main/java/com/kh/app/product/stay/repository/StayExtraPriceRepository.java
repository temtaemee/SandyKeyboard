package com.kh.app.product.stay.repository;

import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.entity.StayExtraPriceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface StayExtraPriceRepository extends JpaRepository<StayExtraPriceEntity, Long> {

    List<StayExtraPriceEntity> findByStay(StayEntity stay);

    List<StayExtraPriceEntity> findByStay_Id(Long stayId);

    /**
     * 주어진 날짜 범위와 겹치는 기존 ExtraPrice 목록을 반환한다.
     * 두 구간이 겹치는 조건: startDate <= endDate AND endDate >= startDate
     */
    @Query("SELECT e FROM StayExtraPriceEntity e " +
           "WHERE e.stay.id = :stayId " +
           "AND e.startDate <= :endDate " +
           "AND e.endDate >= :startDate")
    List<StayExtraPriceEntity> findOverlapping(
            @Param("stayId") Long stayId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
