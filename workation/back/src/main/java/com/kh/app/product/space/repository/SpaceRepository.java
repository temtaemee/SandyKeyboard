package com.kh.app.product.space.repository;

import com.kh.app.product.space.entity.SpaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpaceRepository extends JpaRepository<SpaceEntity, Long>, SpaceRepositoryCustom {
    Optional<SpaceEntity> findByIdAndDelYn(Long id, String delYn);
    Optional<SpaceEntity> findByIdAndDelYnAndVisibleYn(Long id, String delYn, String visibleYn);
}
