package com.kh.app.product.stay.repository;

import com.kh.app.product.stay.dto.request.StaySearchReqDto;
import com.kh.app.product.stay.dto.response.BookedPeriodResDto;
import com.kh.app.product.stay.entity.StayEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface StayRepositoryCustom {

    List<StayEntity> searchList(StaySearchReqDto dto);

    List<StayEntity> searchListForPublic(StaySearchReqDto dto);

    List<StayEntity> searchMyStays(Long memberId);

    List<StayEntity> searchListForAdmin(StaySearchReqDto dto);

    Set<Long> findBookedStayIds(LocalDate startDate, LocalDate endDate);

    List<BookedPeriodResDto> findBookedPeriods(Long stayId);
}
