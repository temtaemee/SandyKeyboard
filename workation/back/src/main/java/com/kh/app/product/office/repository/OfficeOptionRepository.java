package com.kh.app.product.office.repository;

import com.kh.app.product.office.entity.OfficeEntity;
import com.kh.app.product.office.entity.OfficeOption;
import com.kh.app.product.office.entity.OfficeOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfficeOptionRepository extends JpaRepository<OfficeOptionEntity, Long> {
    List<OfficeOptionEntity> findByOffice(OfficeEntity office);
    void deleteAllByOffice(OfficeEntity office);
}
