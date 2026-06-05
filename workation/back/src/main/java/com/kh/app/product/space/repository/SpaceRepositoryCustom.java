package com.kh.app.product.space.repository;

import com.kh.app.product.space.dto.request.SpaceSearchReqDto;
import com.kh.app.product.space.entity.Area;
import com.kh.app.product.space.entity.SpaceEntity;

import java.util.List;

public interface SpaceRepositoryCustom {

    List<SpaceEntity> searchList(SpaceSearchReqDto dto);

    List<SpaceEntity> searchListForPublic(SpaceSearchReqDto dto);

    List<SpaceEntity> searchListForSeller(Long memberId);

    List<SpaceEntity> searchListForAdmin(SpaceSearchReqDto dto);

    List<SpaceEntity> findRecommendedSpaces(Area area);
}
