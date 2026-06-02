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

    // 해당 기간에 취소되지 않은 예약이 있는 stayId 목록 (availableYn 계산용)
    Set<Long> findBookedStayIds(LocalDate startDate, LocalDate endDate);

    // 특정 stay의 전체 예약 구간 (달력 블록 표시용)
    List<BookedPeriodResDto> findBookedPeriods(Long stayId);
}
