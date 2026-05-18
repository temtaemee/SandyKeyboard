package com.kh.app.middle.apply.repository;

import com.kh.app.middle.apply.dto.resp.SpaceApplyRespDto;
import com.kh.app.middle.apply.entity.SpaceApplyEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.nio.channels.FileChannel;

public interface SpaceApplyRepositoryCustom {
    boolean existsPendingApply(Long id, Long spaceId);

    Page<SpaceApplyEntity> getList(Pageable pageable, Long memberId, boolean isAdmin);
}
