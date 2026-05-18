package com.kh.app.product.office.repository;

import com.kh.app.product.office.entity.OfficeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OfficeRepository extends JpaRepository<OfficeEntity, Long> {
    List<OfficeEntity> findAllByDelYn(String delYn);
    Optional<OfficeEntity> findByIdAndDelYn(Long id, String delYn);
}
