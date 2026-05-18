package com.kh.app.product.stay.repository;

import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.entity.StayPictureEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StayPictureRepository extends JpaRepository<StayPictureEntity, Long> {
    List<StayPictureEntity> findByStayOrderBySortOrder(StayEntity stay);
}
