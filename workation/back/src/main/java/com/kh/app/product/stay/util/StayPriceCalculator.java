package com.kh.app.product.stay.util;

import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.entity.StayExtraPriceEntity;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

/**
 * 날짜별 숙박 금액 계산 유틸리티.
 * <p>
 * 체크인~체크아웃 날짜를 순회하며 요일별 단가를 적용하고,
 * ExtraPriceEntity 기간이 포함되면 해당 날짜의 요일별 단가를 우선 적용한다.
 * <p>
 * 이 클래스는 reservation 도메인 등 product 외부에서도 호출 가능하도록
 * public static 메서드로만 구성된다.
 */
public final class StayPriceCalculator {

    private StayPriceCalculator() {
        // 유틸리티 클래스 — 인스턴스화 금지
    }

    /**
     * 총 숙박 금액을 계산한다.
     *
     * @param stay          숙소 엔티티 (요일별 단가 포함)
     * @param checkIn       체크인 날짜 (포함)
     * @param checkOut      체크아웃 날짜 (미포함 — 마지막 박의 다음 날)
     * @param extraPrices   추가금액 목록 (null 또는 빈 리스트 허용)
     * @return 총 숙박 금액 (원)
     */
    public static int calculate(
            StayEntity stay,
            LocalDate checkIn,
            LocalDate checkOut,
            List<StayExtraPriceEntity> extraPrices
    ) {
        int total = 0;
        LocalDate current = checkIn;

        while (current.isBefore(checkOut)) {
            int dayPrice = resolveDayPrice(stay, current, extraPrices);
            total += dayPrice;
            current = current.plusDays(1);
        }

        return total;
    }

    /**
     * 특정 날짜의 1박 단가를 결정한다.
     * ExtraPrice 기간에 포함되면 해당 기간의 요일별 단가를 우선 사용한다.
     */
    private static int resolveDayPrice(
            StayEntity stay,
            LocalDate date,
            List<StayExtraPriceEntity> extraPrices
    ) {
        if (extraPrices != null) {
            for (StayExtraPriceEntity extra : extraPrices) {
                LocalDate extraStart = extra.getStartDate().toLocalDate();
                LocalDate extraEnd   = extra.getEndDate().toLocalDate();
                // startDate <= date <= endDate 이면 ExtraPrice 우선 적용
                if (!date.isBefore(extraStart) && !date.isAfter(extraEnd)) {
                    return getPriceByDayOfWeek(
                            date.getDayOfWeek(),
                            extra.getMonPrice(), extra.getTuePrice(), extra.getWedPrice(),
                            extra.getThuPrice(), extra.getFriPrice(), extra.getSatPrice(),
                            extra.getSunPrice(), extra.getHolidayPrice()
                    );
                }
            }
        }
        // ExtraPrice 미적용 — 기본 요일별 단가 사용
        return getPriceByDayOfWeek(
                date.getDayOfWeek(),
                stay.getMonPrice(), stay.getTuePrice(), stay.getWedPrice(),
                stay.getThuPrice(), stay.getFriPrice(), stay.getSatPrice(),
                stay.getSunPrice(), stay.getHolidayPrice()
        );
    }

    /**
     * 요일에 따라 단가를 반환한다.
     * holidayPrice는 공휴일 구분이 별도로 없으므로 현재는 미사용 (0 반환 시 기본 단가 유지).
     * 공휴일 판별 로직이 추가될 경우 이 메서드를 확장한다.
     */
    private static int getPriceByDayOfWeek(
            DayOfWeek dow,
            int monPrice, int tuePrice, int wedPrice,
            int thuPrice, int friPrice, int satPrice,
            int sunPrice, int holidayPrice
    ) {
        return switch (dow) {
            case MONDAY    -> monPrice;
            case TUESDAY   -> tuePrice;
            case WEDNESDAY -> wedPrice;
            case THURSDAY  -> thuPrice;
            case FRIDAY    -> friPrice;
            case SATURDAY  -> satPrice;
            case SUNDAY    -> sunPrice;
        };
    }
}
