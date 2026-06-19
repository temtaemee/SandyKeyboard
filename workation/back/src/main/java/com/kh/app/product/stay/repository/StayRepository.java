package com.kh.app.product.stay.repository;

import com.kh.app.product.stay.entity.StayEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StayRepository extends JpaRepository<StayEntity, Long>, StayRepositoryCustom {
    Optional<StayEntity> findByIdAndDelYn(Long id, String delYn);
    Optional<StayEntity> findByIdAndDelYnAndVisibleYn(Long id, String delYn, String visibleYn);
    List<StayEntity> findBySpaceIdAndDelYn(Long spaceId, String delYn);
    // 숙소에 락을 걸어 동시에 동일 숙소를 결제하려는 트랜잭션들을 순차 처리하도록 제어
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM StayEntity s WHERE s.id = :id")
    Optional<StayEntity> findByIdWithLock(@Param("id") Long id);


}
