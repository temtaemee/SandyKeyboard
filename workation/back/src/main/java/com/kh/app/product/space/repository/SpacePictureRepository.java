package com.kh.app.product.space.repository;

import com.kh.app.product.space.entity.SpacePictureEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpacePictureRepository extends JpaRepository<SpacePictureEntity, Long> {
    Optional<SpacePictureEntity> findBySpaceIdAndMainYn(Long spaceId, String mainYn);
}
