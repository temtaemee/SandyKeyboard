package com.kh.app.middle.apply.repository;

import com.kh.app.middle.apply.entity.SpaceApplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpaceApplyRepository extends JpaRepository<SpaceApplyEntity, Long>, SpaceApplyRepositoryCustom {
    Optional<SpaceApplyEntity> findByIdAndDelYn(Long applyId, String n);
}
