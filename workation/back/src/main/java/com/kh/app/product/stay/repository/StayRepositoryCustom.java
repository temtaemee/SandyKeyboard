package com.kh.app.product.stay.repository;

import com.kh.app.product.stay.dto.request.StaySearchReqDto;
import com.kh.app.product.stay.entity.StayEntity;

import java.util.List;

public interface StayRepositoryCustom {

    List<StayEntity> searchList(StaySearchReqDto dto);
}
