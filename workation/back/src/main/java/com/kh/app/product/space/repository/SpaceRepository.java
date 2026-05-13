package com.kh.app.product.space.repository;

import com.kh.app.product.space.entity.SpaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceRepository extends JpaRepository<SpaceEntity, Long>, SpaceRepositoryCustom {
}
