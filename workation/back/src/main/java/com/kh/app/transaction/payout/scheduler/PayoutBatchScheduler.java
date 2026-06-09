package com.kh.app.transaction.payout.scheduler;

import com.kh.app.transaction.invoice.service.TaxInvoiceService;
import com.kh.app.transaction.payout.entity.PayoutEntity;
import com.kh.app.transaction.payout.repository.PayoutRepository;
import com.kh.app.transaction.payout.service.PayoutService;
import com.kh.app.transaction.sales.entity.SalesEntity;
import com.kh.app.transaction.sales.repository.SalesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class PayoutBatchScheduler {

    private final SalesRepository salesRepository;
    private final PayoutService payoutService;
    private final PayoutRepository payoutRepository;
    private final TaxInvoiceService taxInvoiceService;


    @Scheduled(cron = "0 0 2 10 * *")  //매월10일 작동하는스케쥴러
    @Scheduled(initialDelay = 3000, fixedDelay = Long.MAX_VALUE)   //실행후 3초뒤 한번 작성
    @Transactional
    public void runMonthlyPayoutAndInvoiceBatch() {
        log.info("============== [정기 정산 및 세금계산서 발행 배치 가동 시작] ==============");

        // 1. 지난달 기준 일자 세팅 (예: 오늘이 6월 10일이면 5월 1일 ~ 5월 31일 연산)
        LocalDate today = LocalDate.now();
        LocalDate lastMonth = today.minusMonths(1);

        LocalDateTime startOfLastMonth = lastMonth.withDayOfMonth(1).atStartOfDay(); // 지난달 1일 00:00:00
        LocalDateTime endOfLastMonth = lastMonth.withDayOfMonth(lastMonth.lengthOfMonth()).atTime(LocalTime.MAX); // 지난달 말일 23:59:59.999

        log.info("배치 대상 기간: {} ~ {}", startOfLastMonth, endOfLastMonth);

        // 2. 해당 기간 동안 발생한 매출 중 미처리된 원장 일괄 대량 조회
        List<SalesEntity> targetSalesList = salesRepository.findUnprocessedSales(startOfLastMonth, endOfLastMonth);

        if (targetSalesList.isEmpty()) {
            log.info("이번 달은 정산 대상 매출 데이터가 존재하지 않습니다. 배치를 종료합니다.");
            return;
        }

        log.info("총 {}건의 매출 데이터를 정산 처리합니다.", targetSalesList.size());

        int successCount = 0;

        // 3. 루프를 돌며 정산(Payout) 생성 및 세금계산서(TaxInvoice) 발행 연동
        for (SalesEntity sales : targetSalesList) {
            try {
                // 부모 트랜잭션 범위 내에서 순차적으로 안전하게 원장 적재
                // 3-1. 정산 대기 데이터 생성
                payoutService.createPayoutTarget(sales);

                // 3-2. 방금 생성된 정산 엔티티 조회 (가장 최근 등록된 세일즈 매핑 ID 기반)
                // 이 구조는 영속성 컨텍스트(1차 캐시) 덕분에 DB 부하 없이 즉시 찾아옵니다.
                PayoutEntity currentPayout = payoutRepository.findAll().stream()
                        .filter(p -> p.getSales().getId().equals(sales.getId()))
                        .findFirst()
                        .orElseThrow(() -> new IllegalStateException("정산 객체 생성 실패 - 세일즈 ID: " + sales.getId()));

                // 3-3. 정산 데이터를 기반으로 세금계산서 즉시 세부 연산 발급
                taxInvoiceService.generateInvoice(currentPayout);

                successCount++;
            } catch (Exception e) {
                // 특정 단건에서 에러가 나더라도 전체 배치가 롤백되어 뻗지 않도록 로그만 남기고 방어
                log.error("❌ 정산 배치 처리 중 개별 오류 발생 - 세일즈 ID: {}, 사유: {}", sales.getId(), e.getMessage());
            }
        }

        log.info("============== [정기 정산 배치 종료] 성공: {}건 / 실패: {}건 ==============",
                successCount, (targetSalesList.size() - successCount));
    }
}