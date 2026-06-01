// src/main/java/com/kh/app/transaction/sales/dto/response/SalesSummaryListResDto.java

package com.kh.app.transaction.sales.dto.response;

import com.kh.app.transaction.sales.entity.SalesEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SalesSummaryListResDto {
    private Long salesId;
    private String spaceName;
    private String stayName;
    private Long salesAmount;
    private Long cancelAmount;
    private Long netSalesAmount;
    private LocalDateTime salesDate;

    /**
     * 💡 엔티티로부터 DTO를 안전하게 변환하는 정적 팩토리 메서드
     * 복잡한 연관관계 조인을 객체 지향적으로 은닉합니다.
     */
    public static SalesSummaryListResDto from(SalesEntity sales) {
        String spaceName = (sales.getPayment() != null &&
                sales.getPayment().getReservation() != null &&
                sales.getPayment().getReservation().getStay() != null &&
                sales.getPayment().getReservation().getStay().getSpace() != null)
                ? sales.getPayment().getReservation().getStay().getSpace().getName() : "-";

        String stayName = (sales.getPayment() != null &&
                sales.getPayment().getReservation() != null &&
                sales.getPayment().getReservation().getStay() != null)
                ? sales.getPayment().getReservation().getStay().getName() : "-";

        return SalesSummaryListResDto.builder()
                .salesId(sales.getId())
                .spaceName(spaceName)
                .stayName(stayName)
                .salesAmount(sales.getSalesAmount())
                .cancelAmount(sales.getCancelAmount())
                .netSalesAmount(sales.getNetSalesAmount())
                .salesDate(sales.getSalesDate())
                .build();
    }
}