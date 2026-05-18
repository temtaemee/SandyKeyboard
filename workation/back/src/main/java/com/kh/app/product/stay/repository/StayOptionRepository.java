package com.kh.app.product.stay.repository;

import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.entity.StayOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StayOptionRepository extends JpaRepository<StayOptionEntity, Long> {
    List<StayOptionEntity> findByStay(StayEntity stay);
    void deleteAllByStay(StayEntity stay);
}
