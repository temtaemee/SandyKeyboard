package com.kh.app.middle.event.repository;

import com.kh.app.middle.event.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventRepository extends JpaRepository<EventEntity, Long>, EventRepositoryCustom {
    Optional<EventEntity> findByIdAndDelYn(Long id, String delYn);
}
