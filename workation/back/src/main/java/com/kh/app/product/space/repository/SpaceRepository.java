package com.kh.app.product.space.repository;

import com.kh.app.product.space.entity.SpaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SpaceRepository extends JpaRepository<SpaceEntity, Long>, SpaceRepositoryCustom {
    List<SpaceEntity> findAllByDelYn(String delYn);
    Optional<SpaceEntity> findByIdAndDelYn(Long id, String delYn);
}
