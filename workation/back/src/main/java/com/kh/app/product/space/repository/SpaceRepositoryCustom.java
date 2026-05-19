package com.kh.app.product.space.repository;

import com.kh.app.product.space.dto.request.SpaceSearchReqDto;
import com.kh.app.product.space.entity.SpaceEntity;

import java.util.List;

public interface SpaceRepositoryCustom {

    List<SpaceEntity> searchList(SpaceSearchReqDto dto);
}
