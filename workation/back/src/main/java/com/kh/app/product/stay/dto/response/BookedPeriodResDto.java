package com.kh.app.product.stay.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class BookedPeriodResDto {
    private LocalDate checkinDate;
    private LocalDate checkoutDate;
}
