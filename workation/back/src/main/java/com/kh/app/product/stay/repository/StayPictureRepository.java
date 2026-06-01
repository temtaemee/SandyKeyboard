package com.kh.app.product.stay.repository;

import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.entity.StayPictureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StayPictureRepository extends JpaRepository<StayPictureEntity, Long> {
    List<StayPictureEntity> findByStayOrderBySortOrder(StayEntity stay);

    @Modifying
    @Query("DELETE FROM StayPictureEntity p WHERE p.stay.id = :stayId AND p.id NOT IN :keepIds")
    void deleteByStayIdAndIdNotIn(@Param("stayId") Long stayId, @Param("keepIds") List<Long> keepIds);

    @Modifying
    @Query("DELETE FROM StayPictureEntity p WHERE p.stay.id = :stayId")
    void deleteByStayId(@Param("stayId") Long stayId);

    @Modifying
    @Query("UPDATE StayPictureEntity p SET p.sortOrder = :sortOrder, p.mainYn = :mainYn WHERE p.id = :id")
    void updateOrderAndMain(@Param("id") Long id, @Param("sortOrder") int sortOrder, @Param("mainYn") String mainYn);
}
