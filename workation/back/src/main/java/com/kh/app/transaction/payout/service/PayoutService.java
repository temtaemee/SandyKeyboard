package com.kh.app.transaction.payout.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.transaction.payout.dto.response.PayoutListResDto;
import com.kh.app.transaction.payout.entity.PayoutEntity;
import com.kh.app.transaction.payout.repository.PayoutRepository;
import com.kh.app.transaction.sales.entity.SalesEntity;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayoutService {

    private final PayoutRepository payoutRepository;

    // 기본 수수료율 설정 (예: 10%)
    private static final double FEE_RATE = 0.10;

    /**
     * 💡 매출 확정 시 정산 대상 데이터를 대기(READY) 상태로 생성하는 로직
     */
    @Transactional
    public void createPayoutTarget(SalesEntity sales) {
        MemberEntity seller = sales.getPayment().getReservation().getStay().getSpace().getSeller();

        long originalAmount = sales.getNetSalesAmount();
        long feeAmount = (long) (originalAmount * FEE_RATE);
        long payoutAmount = originalAmount - feeAmount;

        PayoutEntity payout = PayoutEntity.builder()
                .seller(seller)
                .sales(sales)
                .originalAmount(originalAmount)
                .feeAmount(feeAmount)
                .payoutAmount(payoutAmount)
                .build();

        payoutRepository.save(payout);
    }

    /**
     * 💡 판매자가 본인의 정산 내역 목록 리스트를 확인하는 조회 기능
     */
    public Page<PayoutListResDto> getSellerPayoutList(Long sellerId, int pno) {
        PageRequest pageRequest = PageRequest.of(pno, 10);
        return payoutRepository.findBySellerIdOrderByIdDesc(sellerId, pageRequest)
                .map(PayoutListResDto::from);
    }

    /**
     * 💡 관리자가 정산을 최종 지급 승인/완료 처리할 때 쓰는 로직
     */
    @Transactional
    public void completePayout(Long payoutId) {
        PayoutEntity payout = payoutRepository.findById(payoutId)
                .orElseThrow(() -> new EntityNotFoundException("정산 대상을 찾을 수 없습니다."));
        payout.completePayout();
    }
}