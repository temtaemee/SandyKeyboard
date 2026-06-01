package com.kh.app.product.space.repository;

import com.kh.app.product.space.entity.SpacePictureCategory;
import com.kh.app.product.space.entity.SpacePictureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SpacePictureRepository extends JpaRepository<SpacePictureEntity, Long> {
    Optional<SpacePictureEntity> findBySpaceIdAndMainYn(Long spaceId, String mainYn);
    List<SpacePictureEntity> findBySpaceIdOrderBySortOrder(Long spaceId);
    void deleteBySpaceIdAndIdNotIn(Long spaceId, List<Long> keepIds);
    void deleteBySpaceId(Long spaceId);

    @Modifying
    @Query("UPDATE SpacePictureEntity p SET p.sortOrder = :sortOrder, p.mainYn = :mainYn WHERE p.id = :id")
    void updateOrderAndMain(@Param("id") Long id, @Param("sortOrder") int sortOrder, @Param("mainYn") String mainYn);

    @Modifying
    @Query("UPDATE SpacePictureEntity p SET p.category = :category WHERE p.id = :id")
    void updateCategory(@Param("id") Long id, @Param("category") SpacePictureCategory category);
}
