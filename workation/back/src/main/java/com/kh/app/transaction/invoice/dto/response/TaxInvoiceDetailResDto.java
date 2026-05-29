package com.kh.app.transaction.invoice.dto.response;

import com.kh.app.transaction.invoice.entity.TaxInvoiceEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TaxInvoiceDetailResDto {
    private Long invoiceId;
    private String issueNo;
    private String sellerBusinessNo; // 판매자 사업자등록번호 연동 조회
    private String sellerAccountName;// 판매자 상호명
    private Long supplyValue;
    private Long taxAmount;
    private Long totalAmount;
    private LocalDateTime issuedAt;
    private String status;

    public static TaxInvoiceDetailResDto from(TaxInvoiceEntity entity) {
        // 소속 멤버의 셀러 원장 데이터 안전하게 탐색 방어 코드 결합
        String businessNo = (entity.getSeller().getSeller() != null) ? entity.getSeller().getSeller().getBusinessNo() : "미등록";
        String accountName = (entity.getSeller().getSeller() != null) ? entity.getSeller().getSeller().getAccountName() : "미등록";

        return TaxInvoiceDetailResDto.builder()
                .invoiceId(entity.getId())
                .issueNo(entity.getIssueNo())
                .sellerBusinessNo(businessNo)
                .sellerAccountName(accountName)
                .supplyValue(entity.getSupplyValue())
                .taxAmount(entity.getTaxAmount())
                .totalAmount(entity.getTotalAmount())
                .issuedAt(entity.getIssuedAt())
                .status(entity.getStatus())
                .build();
    }
}