package com.kh.app.transaction.invoice.service;

import com.kh.app.transaction.invoice.dto.response.TaxInvoiceDetailResDto;
import com.kh.app.transaction.invoice.entity.TaxInvoiceEntity;
import com.kh.app.transaction.invoice.repository.TaxInvoiceRepository;
import com.kh.app.transaction.payout.entity.PayoutEntity;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaxInvoiceService {

    private final TaxInvoiceRepository taxInvoiceRepository;

    /**
     * 💡 [핵심] 정산 완료 시 호출되거나 어드민이 수동으로 세금계산서를 전자 발행하는 알고리즘
     */
    @Transactional
    public void generateInvoice(PayoutEntity payout) {
        // 이미 해당 정산 건에 대해 발행된 이력이 있는지 검증
        if (taxInvoiceRepository.findByPayoutId(payout.getId()).isPresent()) {
            throw new IllegalStateException("이미 세금계산서가 발행된 정산 내역입니다.");
        }

        // 수수료 총액(feeAmount)을 기준으로 부가세(10%)와 공급가액 분할 계산
        long totalFee = payout.getFeeAmount();
        long supplyValue = Math.round(totalFee / 1.1); // 공급가액 반올림 연산
        long taxAmount = totalFee - supplyValue;       // 나머지 금액을 부가세로 책정

        // 국세청 표준 승인번호 형식 시뮬레이션 (YYYYMMDD-UUID8자리)
        String todayStr = LocalDateTime.now().toString().substring(0, 10).replace("-", "");
        String issueNo = todayStr + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        TaxInvoiceEntity invoice = TaxInvoiceEntity.builder()
                .issueNo(issueNo)
                .payout(payout)
                .seller(payout.getSeller())
                .supplyValue(supplyValue)
                .taxAmount(taxAmount)
                .totalAmount(totalFee)
                .issuedAt(LocalDateTime.now())
                .build();

        taxInvoiceRepository.save(invoice);
    }

    /**
     * 💡 판매자 마이페이지용 발급된 전자세금계산서 페이징 목록 조회
     */
    public Page<TaxInvoiceDetailResDto> getSellerInvoiceList(Long sellerId, int pno) {
        PageRequest pageRequest = PageRequest.of(pno, 10);
        return taxInvoiceRepository.findBySellerIdOrderByIdDesc(sellerId, pageRequest)
                .map(TaxInvoiceDetailResDto::from);
    }

    /**
     * 💡 단건 국세청 승인 세금계산서 상세 조회 (프론트엔드 인쇄 팝업용)
     */
    public TaxInvoiceDetailResDto getInvoiceDetail(Long invoiceId) {
        TaxInvoiceEntity entity = taxInvoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new EntityNotFoundException("해당 세금계산서 원장을 찾을 수 없습니다."));
        return TaxInvoiceDetailResDto.from(entity);
    }

    // 전체 목록 조회 로직
    public List<TaxInvoiceDetailResDto> findAllForAdmin() {
        return taxInvoiceRepository.findAll().stream()
                .map(TaxInvoiceDetailResDto::from) // Entity -> DTO 변환
                .toList();
    }

    // 상세 조회 로직
    public TaxInvoiceDetailResDto findByIdForAdmin(Long id) {
        return taxInvoiceRepository.findById(id)
                .map(TaxInvoiceDetailResDto::from)
                .orElseThrow(() -> new IllegalArgumentException("해당 세금계산서를 찾을 수 없습니다."));
    }
}