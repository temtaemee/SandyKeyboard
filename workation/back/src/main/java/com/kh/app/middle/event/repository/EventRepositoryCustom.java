package com.kh.app.middle.event.repository;

import com.kh.app.middle.event.entity.EventEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EventRepositoryCustom {
    Page<EventEntity> getList(Pageable pageable);
}
