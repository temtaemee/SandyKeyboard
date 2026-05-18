package com.kh.app.product.office.repository;

import com.kh.app.product.office.entity.OfficeEntity;
import com.kh.app.product.office.entity.OfficePictureEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfficePictureRepository extends JpaRepository<OfficePictureEntity, Long> {
    List<OfficePictureEntity> findByOfficeOrderBySortOrder(OfficeEntity office);
}
