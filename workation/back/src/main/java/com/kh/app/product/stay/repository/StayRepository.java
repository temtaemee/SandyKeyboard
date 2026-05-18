package com.kh.app.product.stay.repository;

import com.kh.app.product.stay.entity.StayEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StayRepository extends JpaRepository<StayEntity, Long> {
    List<StayEntity> findAllByDelYn(String delYn);
    Optional<StayEntity> findByIdAndDelYn(Long id, String delYn);
}
