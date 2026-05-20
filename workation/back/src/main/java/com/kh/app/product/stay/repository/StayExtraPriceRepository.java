package com.kh.app.product.stay.repository;

import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.entity.StayExtraPriceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StayExtraPriceRepository extends JpaRepository<StayExtraPriceEntity, Long> {
    List<StayExtraPriceEntity> findByStay(StayEntity stay);
}
