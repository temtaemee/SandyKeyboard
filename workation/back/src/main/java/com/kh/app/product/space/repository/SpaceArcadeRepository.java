package com.kh.app.product.space.repository;

import com.kh.app.product.space.entity.SpaceArcadeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SpaceArcadeRepository extends JpaRepository<SpaceArcadeEntity, Long> {
    List<SpaceArcadeEntity> findBySpaceId(Long spaceId);

    @Modifying
    @Query("DELETE FROM SpaceArcadeEntity sa WHERE sa.space.id = :spaceId")
    void deleteBySpaceId(@Param("spaceId") Long spaceId);
}
