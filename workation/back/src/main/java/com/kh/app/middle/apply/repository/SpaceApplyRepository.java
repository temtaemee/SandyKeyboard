package com.kh.app.middle.apply.repository;

import com.kh.app.middle.apply.entity.SpaceApplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceApplyRepository extends JpaRepository<SpaceApplyEntity, Long>, SpaceApplyRepositoryCustom {
}
