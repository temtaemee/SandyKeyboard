package com.kh.app.product.space.repository;

import com.kh.app.product.space.entity.SpacePictureEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SpacePictureRepository extends JpaRepository<SpacePictureEntity, Long> {
    Optional<SpacePictureEntity> findBySpaceIdAndMainYn(Long spaceId, String mainYn);
    List<SpacePictureEntity> findBySpaceIdOrderBySortOrder(Long spaceId);
    void deleteBySpaceIdAndIdNotIn(Long spaceId, List<Long> keepIds);
    void deleteBySpaceId(Long spaceId);
}
