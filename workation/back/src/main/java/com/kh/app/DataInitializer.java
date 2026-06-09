package com.kh.app;

import com.kh.app.board.faq.entity.FaqEntity;
import com.kh.app.board.faq.repository.FaqRepository;
import com.kh.app.board.notice.entity.NoticeEntity;
import com.kh.app.board.notice.repository.NoticeRepository;
import com.kh.app.board.review.entity.ReviewEntity;
import com.kh.app.board.review.repository.ReviewRepository;
import com.kh.app.company.entity.CompanyEntity;
import com.kh.app.company.repository.CompanyRepository;
import com.kh.app.member.entity.*;
import com.kh.app.member.repository.*;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.middle.coupon.entity.CouponStatus;
import com.kh.app.middle.coupon.repository.CouponRepository;
import com.kh.app.product.common.util.S3PictureUploader;
import com.kh.app.product.space.entity.*;
import com.kh.app.product.space.repository.*;
import com.kh.app.product.stay.entity.*;
import com.kh.app.product.stay.repository.*;
import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.payment.enums.PaymentMethod;
import com.kh.app.transaction.payment.enums.PaymentStatus;
import com.kh.app.transaction.payment.repository.PaymentRepository;
import com.kh.app.transaction.refund.entity.RefundEntity;
import com.kh.app.transaction.refund.enums.RefundReason;
import com.kh.app.transaction.refund.repository.RefundRepository;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import com.kh.app.transaction.reservation.repository.ReservationRepository;
import com.kh.app.transaction.sales.entity.SalesEntity;
import com.kh.app.transaction.sales.repository.SalesRepository;
import com.kh.app.transaction.payout.entity.PayoutEntity;
import com.kh.app.transaction.payout.repository.PayoutRepository;
import com.kh.app.transaction.payment.enums.PayoutStatus;
import com.kh.app.transaction.invoice.entity.TaxInvoiceEntity;
import com.kh.app.transaction.invoice.repository.TaxInvoiceRepository;
import com.kh.app.middle.coupon.entity.MemberCouponEntity;
import com.kh.app.middle.coupon.repository.MemberCouponRepository;
import com.kh.app.mypage.wishlist.entity.WishlistEntity;
import com.kh.app.mypage.wishlist.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(1)
public class DataInitializer implements CommandLineRunner {

    private static final String IMG = "/dummy-images";

    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;
    private final SellerRepository sellerRepository;
    private final BankRepository bankRepository;
    private final CompanyRepository companyRepository;
    private final SpaceRepository spaceRepository;
    private final SpacePictureRepository spacePictureRepository;
    private final SpaceArcadeRepository spaceArcadeRepository;
    private final ArcadeRepository arcadeRepository;
    private final StayRepository stayRepository;
    private final StayPictureRepository stayPictureRepository;
    private final StayOptionRepository stayOptionRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final SalesRepository salesRepository;
    private final RefundRepository refundRepository;
    private final PayoutRepository payoutRepository;
    private final TaxInvoiceRepository taxInvoiceRepository;
    private final CouponRepository couponRepository;
    private final MemberCouponRepository memberCouponRepository;
    private final WishlistRepository wishlistRepository;
    private final FaqRepository faqRepository;
    private final NoticeRepository noticeRepository;
    private final ReviewRepository reviewRepository;
    private final S3PictureUploader s3PictureUploader;
    private final BCryptPasswordEncoder passwordEncoder;

    private int orderCounter = 0;
    private int paymentCounter = 0;

    @Override
    @Transactional
    public void run(String... args) {
        if (spaceRepository.count() > 0) {
            log.info("[DataInitializer] 기존 데이터 존재. 스킵. spaceCount={}", spaceRepository.count());
            return;
        }
        log.info("[DataInitializer] 더미 데이터 삽입 시작");

        seedCompanies();
        List<BankEntity> banks = seedBanks();

        MemberEntity admin = seedAdmin();
        List<MemberEntity> users = seedUsers();
        List<MemberEntity> sellers = seedSellers(banks);

        seedCoupons();
        List<ArcadeEntity> arcades = seedArcades();

        List<StayEntity> allStays = new ArrayList<>();
        seedGangwon(sellers.get(0), arcades, allStays);
        seedGyeonggi(sellers.get(1), arcades, allStays);
        seedGyeongnam(sellers.get(2), arcades, allStays);

        List<ReservationEntity> reservations = seedReservations(users, allStays);

        List<SpaceEntity> allSpaces = allStays.stream()
                .map(StayEntity::getSpace).distinct().toList();

        seedPaymentsAndSales(reservations);
        seedPayoutsAndInvoices();
        seedHistoricalSalesAndPayouts(sellers, users, allStays);
        seedReviews(reservations);
        seedMemberCoupons(users);
        seedWishlists(users, allSpaces);
        seedFaqs(admin);
        seedNotices(admin);

        log.info("[DataInitializer] 완료. spaces={}, stays={}, reservations={}",
                spaceRepository.count(), stayRepository.count(), reservationRepository.count());
    }

    // ───────────────────────────────────────────────
    // 회사
    // ───────────────────────────────────────────────
    private void seedCompanies() {
        List<String[]> list = List.of(
                new String[]{"kh 정보교육원", "111-22-33333"},
                new String[]{"네이버웹툰",    "222-33-44444"},
                new String[]{"카카오페이",    "333-44-55555"},
                new String[]{"토스뱅크",     "444-55-66666"}
        );
        list.forEach(c -> {
            if (!companyRepository.existsByCompanyName(c[0]))
                companyRepository.save(CompanyEntity.builder().companyName(c[0]).businessNo(c[1]).build());
        });
    }

    // ───────────────────────────────────────────────
    // 은행
    // ───────────────────────────────────────────────
    private List<BankEntity> seedBanks() {
        return bankRepository.saveAll(List.of(
                BankEntity.builder().bankName("국민은행").build(),
                BankEntity.builder().bankName("신한은행").build(),
                BankEntity.builder().bankName("우리은행").build(),
                BankEntity.builder().bankName("하나은행").build(),
                BankEntity.builder().bankName("농협은행").build(),
                BankEntity.builder().bankName("기업은행").build(),
                BankEntity.builder().bankName("SC제일은행").build(),
                BankEntity.builder().bankName("씨티은행").build(),
                BankEntity.builder().bankName("케이뱅크").build(),
                BankEntity.builder().bankName("카카오뱅크").build(),
                BankEntity.builder().bankName("토스뱅크").build(),
                BankEntity.builder().bankName("부산은행").build(),
                BankEntity.builder().bankName("대구은행").build(),
                BankEntity.builder().bankName("광주은행").build(),
                BankEntity.builder().bankName("제주은행").build()
        ));
    }

    // ───────────────────────────────────────────────
    // 회원
    // ───────────────────────────────────────────────
    private MemberEntity seedAdmin() {
        MemberEntity admin = memberRepository.save(MemberEntity.builder()
                .username("admin")
                .password("$2a$10$xXAvSFMhjSjhVKnshkEt9uQCqIRP30sGWzHRpko42qQxggg7Mn1wm") // 1234
                .roleSet(Set.of(Role.ADMIN))
                .build());
        profileRepository.save(MemberProfileEntity.builder()
                .member(admin).name("관리자").phone("010-0000-0000").email("admin@workation.com").build());
        return admin;
    }

    private List<MemberEntity> seedUsers() {
        return List.of(
                createMember("user01", "user01!", Role.USER, "김유저", "010-1111-2222", "user01@workation.com"),
                createMember("user02", "user02!", Role.USER, "이유저", "010-3333-4444", "user02@workation.com"),
                createMember("user03", "user03!", Role.USER, "박유저", "010-5555-6666", "user03@workation.com")
        );
    }

    private List<MemberEntity> seedSellers(List<BankEntity> banks) {
        return List.of(
                createSeller("seller01", "seller01!", "강원 운영자", "010-5555-1001", "seller01@workation.com",
                        banks.get(0), "101-81-10001", "11111111111111", "강원 워케이션", "(주)강원워케이션네트웍스"),
                createSeller("seller02", "seller02!", "경기 운영자", "010-5555-1002", "seller02@workation.com",
                        banks.get(1), "101-81-10002", "22222222222222", "경기스테이랩", "경기스테이랩(주)"),
                createSeller("seller03", "seller03!", "경남 운영자", "010-5555-1003", "seller03@workation.com",
                        banks.get(2), "101-81-10003", "33333333333333", "경남 오션워크", "경남오션워크플래닝")
        );
    }

    // ───────────────────────────────────────────────
    // 쿠폰
    // ───────────────────────────────────────────────
    private void seedCoupons() {
        if (couponRepository.findByCouponCode("WELCOME-10").isEmpty()) {
            couponRepository.save(CouponEntity.builder()
                    .couponCode("WELCOME-10").couponName("신규가입 환영쿠폰")
                    .discountRate(10).remainQty(9999).couponStatus(CouponStatus.A).validDays(7).build());
        }
        if (couponRepository.findByCouponCode("BIRTHDAY-20").isEmpty()) {
            couponRepository.save(CouponEntity.builder()
                    .couponCode("BIRTHDAY-20").couponName("생일 축하 특별 쿠폰")
                    .discountRate(20).remainQty(9999).couponStatus(CouponStatus.A).validDays(30).build());
        }
        // 아래 2개 추가
        if (couponRepository.findByCouponCode("BEST_REVIEW_20").isEmpty()) {
            couponRepository.save(CouponEntity.builder()
                    .couponCode("BEST_REVIEW_20").couponName("베스트리뷰자 쿠폰")
                    .discountRate(20).remainQty(1000).couponStatus(CouponStatus.A).validDays(30).build());
        }
        if (couponRepository.findByCouponCode("INVITE_10").isEmpty()) {
            couponRepository.save(CouponEntity.builder()
                    .couponCode("INVITE_10").couponName("지인초대 쿠폰")
                    .discountRate(10).remainQty(1000).couponStatus(CouponStatus.A).validDays(30).build());
        }
    }

    // ───────────────────────────────────────────────
    // 편의시설
    // ───────────────────────────────────────────────
    private List<ArcadeEntity> seedArcades() {
        return arcadeRepository.saveAll(List.of(
                ArcadeEntity.builder().name("야외 수영장").build(),
                ArcadeEntity.builder().name("피트니스 센터").build(),
                ArcadeEntity.builder().name("루프탑 라운지").build(),
                ArcadeEntity.builder().name("세미나룸 A").build(),
                ArcadeEntity.builder().name("세미나룸 B").build(),
                ArcadeEntity.builder().name("공용 주방").build(),
                ArcadeEntity.builder().name("바베큐 테라스").build(),
                ArcadeEntity.builder().name("코인세탁실").build(),
                ArcadeEntity.builder().name("자전거 대여").build(),
                ArcadeEntity.builder().name("족욕탕").build()
        ));
    }

    // ───────────────────────────────────────────────
    // 강원 (seller01) — 3개 공간, 각 3개 스테이
    // ───────────────────────────────────────────────
    private void seedGangwon(MemberEntity seller, List<ArcadeEntity> arcades, List<StayEntity> allStays) {

        // ── Hotel 1: 강원 포레스트 워케이션 호텔 ──
        SpaceEntity s1 = createSpace(seller, "강원 포레스트 워케이션 호텔", "0331231001",
                "gangwon01@workation.com", "숲과 산 전망이 있는 강원 워케이션 호텔",
                "조용한 산림 속에서 숙박과 업무를 함께 해결할 수 있는 강원형 워케이션 공간입니다.",
                "강원특별자치도 속초시 설악산로", "101", Area.GANGWON, "38.2070000", "128.5910000");
        linkArcades(s1, arcades, 0, 1, 2, 3);
        addSpacePics(s1, List.of(
                sp("gangwon/hotel1/강원1외관.png",   SpacePictureCategory.EXTERIOR, true,  1),
                sp("gangwon/hotel1/강원1로비.png",   SpacePictureCategory.FACILITY, false, 2),
                sp("gangwon/hotel1/강원1오피스.png", SpacePictureCategory.OFFICE,   false, 3),
                sp("gangwon/hotel1/강원1카페.png",   SpacePictureCategory.DINING,   false, 4),
                sp("gangwon/hotel1/강원1주차장.png", SpacePictureCategory.AMENITY,  false, 5)
        ));
        allStays.add(createStayFull(s1, "강원 포레스트 디럭스룸",
                "업무 데스크와 숲 전망을 갖춘 디럭스룸",
                "넓은 책상, 고속 Wi-Fi, 산 전망을 갖춰 장기 워케이션에 적합한 객실입니다.",
                2, 3, "Y", 145000, 185000, 215000,
                new StayOption[]{StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.REFRIGERATOR},
                List.of(si("gangwon/hotel1/강원1스테이(디럭스룸)1.png", true,  1),
                        si("gangwon/hotel1/강원1스테이(디럭스룸)2.png", false, 2),
                        si("gangwon/hotel1/강원1스테이(디럭스룸)3.png", false, 3),
                        si("gangwon/hotel1/강원1스테이(디럭스룸)4.png", false, 4))));
        allStays.add(createStayFull(s1, "강원 포레스트 스위트룸",
                "분리형 라운지와 프리미엄 업무 공간이 있는 스위트룸",
                "휴식 공간과 업무 공간이 분리되어 팀 단위 워케이션이나 장기 체류에 좋습니다.",
                2, 4, "Y", 220000, 270000, 320000,
                new StayOption[]{StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.COFFEE_MACHINE, StayOption.BATHTUB},
                List.of(si("gangwon/hotel1/강원1스테이(스위트룸)1.png", true,  1),
                        si("gangwon/hotel1/강원1스테이(스위트룸)2.png", false, 2),
                        si("gangwon/hotel1/강원1스테이(스위트룸)3.png", false, 3),
                        si("gangwon/hotel1/강원1스테이(스위트룸)4.png", false, 4),
                        si("gangwon/hotel1/강원1스테이(스위트룸)5.png", false, 5))));
        allStays.add(createStayFull(s1, "강원 포레스트 패밀리룸",
                "가족이나 팀 단위에 적합한 넓은 패밀리룸",
                "2개의 독립 공간과 거실, 주방을 갖춰 4~5인 가족 워케이션에 최적화된 객실입니다.",
                4, 6, "N", 280000, 350000, 420000,
                new StayOption[]{StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.KITCHEN, StayOption.REFRIGERATOR, StayOption.COOKING_AVAILABLE},
                List.of(si("gangwon/hotel1/강원1스테이(패밀리룸)1.png", true,  1),
                        si("gangwon/hotel1/강원1스테이(패밀리룸)2.png", false, 2),
                        si("gangwon/hotel1/강원1스테이(패밀리룸)3.png", false, 3))));

        // ── Hotel 2: 강원 계곡 워케이션 빌라 ──
        SpaceEntity s2 = createSpace(seller, "강원 계곡 워케이션 빌라", "0331231002",
                "gangwon02@workation.com", "청정 계곡 옆 독채형 워케이션 빌라",
                "계곡 소리를 들으며 작업할 수 있는 독채 빌라형 워케이션 공간입니다.",
                "강원특별자치도 평창군 대관령면 올림픽로", "202", Area.GANGWON, "37.6400000", "128.7200000");
        linkArcades(s2, arcades, 6, 7, 8, 9);
        addSpacePics(s2, List.of(
                sp("gangwon/hotel2/강원2외관.png",   SpacePictureCategory.EXTERIOR, true,  1),
                sp("gangwon/hotel2/강원2로비.png",   SpacePictureCategory.FACILITY, false, 2),
                sp("gangwon/hotel2/강원2오피스.png", SpacePictureCategory.OFFICE,   false, 3),
                sp("gangwon/hotel2/강원2카페.png",   SpacePictureCategory.DINING,   false, 4),
                sp("gangwon/hotel2/강원2주차장.png", SpacePictureCategory.AMENITY,  false, 5)
        ));
        allStays.add(createStayFull(s2, "강원 계곡 디럭스룸",
                "계곡뷰와 업무 공간을 갖춘 디럭스룸",
                "통창 너머 계곡이 보이고, 고속 Wi-Fi와 업무 전용 책상이 구비된 객실입니다.",
                2, 3, "Y", 155000, 195000, 230000,
                new StayOption[]{StayOption.DESK, StayOption.RIVER_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.AMENITY},
                List.of(si("gangwon/hotel2/강원2스테이(디럭스룸)1.png", true,  1),
                        si("gangwon/hotel2/강원2스테이(디럭스룸)2.png", false, 2),
                        si("gangwon/hotel2/강원2스테이(디럭스룸)3.png", false, 3),
                        si("gangwon/hotel2/강원2스테이(디럭스룸)4.png", false, 4))));
        allStays.add(createStayFull(s2, "강원 계곡 스위트룸",
                "풀옵션 주방과 계곡 테라스를 갖춘 스위트룸",
                "별도 작업실과 독채 테라스, 취사 가능한 주방을 갖춘 프리미엄 스위트입니다.",
                2, 4, "Y", 235000, 285000, 340000,
                new StayOption[]{StayOption.DESK, StayOption.RIVER_VIEW, StayOption.KITCHEN, StayOption.BATHTUB, StayOption.COFFEE_MACHINE},
                List.of(si("gangwon/hotel2/강원2스테이(스위트룸)1.png", true,  1),
                        si("gangwon/hotel2/강원2스테이(스위트룸)2.png", false, 2),
                        si("gangwon/hotel2/강원2스테이(스위트룸)3.png", false, 3),
                        si("gangwon/hotel2/강원2스테이(스위트룸)4.png", false, 4),
                        si("gangwon/hotel2/강원2스테이(스위트룸)5.png", false, 5))));
        allStays.add(createStayFull(s2, "강원 계곡 패밀리빌라",
                "독채 빌라 전체를 사용하는 패밀리룸",
                "빌라 전체를 독점 사용하는 형태로 가족 단위 워케이션에 최적입니다.",
                4, 8, "N", 380000, 450000, 530000,
                new StayOption[]{StayOption.DESK, StayOption.RIVER_VIEW, StayOption.KITCHEN, StayOption.COOKING_AVAILABLE, StayOption.TABLEWARE},
                List.of(si("gangwon/hotel2/강원2스테이(패밀리룸)1.png", true,  1),
                        si("gangwon/hotel2/강원2스테이(패밀리룸)2.png", false, 2),
                        si("gangwon/hotel2/강원2스테이(패밀리룸)3.png", false, 3))));

        // ── Hotel 3: 강원 스노우 워케이션 리조트 ──
        SpaceEntity s3 = createSpace(seller, "강원 스노우 워케이션 리조트", "0331231003",
                "gangwon03@workation.com", "스키장 인근 리조트형 워케이션",
                "스키장 리프트 5분 거리에 위치한 리조트형 워케이션 공간입니다.",
                "강원특별자치도 정선군 고한읍 고한리", "303", Area.GANGWON, "37.2200000", "128.6400000");
        linkArcades(s3, arcades, 0, 3, 4, 5);
        addSpacePics(s3, List.of(
                sp("gangwon/hotel3/강원3외관.png",   SpacePictureCategory.EXTERIOR, true,  1),
                sp("gangwon/hotel3/강원3로비.png",   SpacePictureCategory.FACILITY, false, 2),
                sp("gangwon/hotel3/강원3오피스.png", SpacePictureCategory.OFFICE,   false, 3),
                sp("gangwon/hotel3/강원3카페.png",   SpacePictureCategory.DINING,   false, 4),
                sp("gangwon/hotel3/강원3주차장.png", SpacePictureCategory.AMENITY,  false, 5)
        ));
        allStays.add(createStayFull(s3, "강원 스노우 디럭스룸",
                "설산 전망의 워케이션 디럭스룸",
                "설산 뷰와 업무 전용 책상으로 집중력 높은 작업 환경을 제공합니다.",
                2, 3, "Y", 175000, 215000, 255000,
                new StayOption[]{StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.BIDET},
                List.of(si("gangwon/hotel3/강원3스테이(디럭스룸)1.png", true,  1),
                        si("gangwon/hotel3/강원3스테이(디럭스룸)2.png", false, 2),
                        si("gangwon/hotel3/강원3스테이(디럭스룸)3.png", false, 3),
                        si("gangwon/hotel3/강원3스테이(디럭스룸)4.png", false, 4))));
        allStays.add(createStayFull(s3, "강원 스노우 스위트룸",
                "자쿠지와 리조트 라운지가 딸린 스위트룸",
                "설산 전망 자쿠지 욕조와 전용 라운지를 갖춘 프리미엄 객실입니다.",
                2, 4, "Y", 260000, 320000, 385000,
                new StayOption[]{StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.BATHTUB, StayOption.COFFEE_MACHINE, StayOption.AMENITY},
                List.of(si("gangwon/hotel3/강원3스테이(스위트룸)1.png", true,  1),
                        si("gangwon/hotel3/강원3스테이(스위트룸)2.png", false, 2),
                        si("gangwon/hotel3/강원3스테이(스위트룸)3.png", false, 3),
                        si("gangwon/hotel3/강원3스테이(스위트룸)4.png", false, 4),
                        si("gangwon/hotel3/강원3스테이(스위트룸)5.png", false, 5))));
        allStays.add(createStayFull(s3, "강원 스노우 패밀리룸",
                "스키 가족 여행에 최적화된 패밀리룸",
                "넓은 거실과 별도 침실 2개로 구성된 대가족 워케이션 룸입니다.",
                4, 6, "N", 340000, 430000, 510000,
                new StayOption[]{StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.KITCHEN, StayOption.REFRIGERATOR, StayOption.INDUCTION},
                List.of(si("gangwon/hotel3/강원3스테이(패밀리룸)1.png", true,  1),
                        si("gangwon/hotel3/강원3스테이(패밀리룸)2.png", false, 2),
                        si("gangwon/hotel3/강원3스테이(패밀리룸)3.png", false, 3))));
    }

    // ───────────────────────────────────────────────
    // 경기 (seller02) — 3개 공간, 각 3개 스테이
    // ───────────────────────────────────────────────
    private void seedGyeonggi(MemberEntity seller, List<ArcadeEntity> arcades, List<StayEntity> allStays) {

        // ── Hotel 1: 경기 비즈니스 워케이션 호텔 ──
        SpaceEntity g1 = createSpace(seller, "경기 비즈니스 워케이션 호텔", "0311232002",
                "gyeonggi01@workation.com", "수도권 접근성이 좋은 비즈니스형 워케이션 호텔",
                "회의와 숙박을 함께 운영하기 좋은 경기권 도심형 워케이션 공간입니다.",
                "경기도 성남시 분당구 판교역로", "202", Area.GYEONGGI, "37.3947000", "127.1112000");
        linkArcades(g1, arcades, 1, 2, 3, 4);
        addSpacePics(g1, List.of(
                sp("gyeonggi/호텔1/경기호텔외관1.png",  SpacePictureCategory.EXTERIOR, true,  1),
                sp("gyeonggi/호텔1/경기호텔로비1.png",  SpacePictureCategory.FACILITY, false, 2),
                sp("gyeonggi/호텔1/경기호텔로비2.png",  SpacePictureCategory.FACILITY, false, 3),
                sp("gyeonggi/호텔1/경기호텔오피스1.png",SpacePictureCategory.OFFICE,   false, 4),
                sp("gyeonggi/호텔1/경기호텔오피스2.png",SpacePictureCategory.OFFICE,   false, 5),
                sp("gyeonggi/호텔1/경기호텔주차장1.png",SpacePictureCategory.AMENITY,  false, 6)
        ));
        allStays.add(createStayFull(g1, "경기 비즈니스 디럭스룸",
                "도심 접근성과 업무 편의성을 함께 갖춘 디럭스룸",
                "판교 업무지구와 가까우며 객실 내 책상과 빠른 네트워크 환경을 제공합니다.",
                2, 2, "Y", 135000, 175000, 205000,
                new StayOption[]{StayOption.DESK, StayOption.CITY_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.COFFEE_MACHINE},
                List.of(si("gyeonggi/호텔1/경기호텔스테이(디럭스룸)1.png", true,  1),
                        si("gyeonggi/호텔1/경기호텔스테이(디럭스룸)2.png", false, 2),
                        si("gyeonggi/호텔1/경기호텔스테이(디럭스룸)3.png", false, 3),
                        si("gyeonggi/호텔1/경기호텔스테이(디럭스룸)4.png", false, 4))));
        allStays.add(createStayFull(g1, "경기 비즈니스 스위트룸",
                "회의 전후 체류에 적합한 넓은 스위트룸",
                "라운지형 객실과 업무용 데스크를 갖춘 객실로 소규모 출장 일정에 적합합니다.",
                2, 4, "Y", 205000, 255000, 300000,
                new StayOption[]{StayOption.DESK, StayOption.CITY_VIEW, StayOption.BATHTUB, StayOption.REFRIGERATOR},
                List.of(si("gyeonggi/호텔1/경기호텔스테이(스위트룸)1.png", true,  1),
                        si("gyeonggi/호텔1/경기호텔스테이(스위트룸)2.png", false, 2),
                        si("gyeonggi/호텔1/경기호텔스테이(스위트룸)3.png", false, 3),
                        si("gyeonggi/호텔1/경기호텔스테이(스위트룸)4.png", false, 4),
                        si("gyeonggi/호텔1/경기호텔스테이(스위트룸)5.png", false, 5))));
        allStays.add(createStayFull(g1, "경기 비즈니스 패밀리룸",
                "소규모 팀 전용 패밀리룸",
                "회의 겸 숙박용 넓은 룸, 이동식 파티션, 팀 테이블 포함.",
                3, 5, "Y", 250000, 310000, 370000,
                new StayOption[]{StayOption.DESK, StayOption.CITY_VIEW, StayOption.REFRIGERATOR, StayOption.MICROWAVE, StayOption.INDUCTION},
                List.of(si("gyeonggi/호텔1/경기호텔스테이(패밀리룸)1.png", true,  1),
                        si("gyeonggi/호텔1/경기호텔스테이(패밀리룸)2.png", false, 2),
                        si("gyeonggi/호텔1/경기호텔스테이(패밀리룸)3.png", false, 3))));

        // ── Hotel 2: 경기 캠퍼스 워케이션 스위트 ──
        SpaceEntity g2 = createSpace(seller, "경기 캠퍼스 워케이션 스위트", "0311232003",
                "gyeonggi02@workation.com", "IT 캠퍼스 인접 모던 워케이션 스위트",
                "광교 테크노밸리 인근의 모던 빌딩형 워케이션 공간입니다.",
                "경기도 수원시 영통구 광교로", "456", Area.GYEONGGI, "37.2900000", "127.0500000");
        linkArcades(g2, arcades, 0, 2, 3, 7);
        addSpacePics(g2, List.of(
                sp("gyeonggi/hotel2/경기2외관.png",   SpacePictureCategory.EXTERIOR, true,  1),
                sp("gyeonggi/hotel2/경기2로비.png",   SpacePictureCategory.FACILITY, false, 2),
                sp("gyeonggi/hotel2/경기2오피스.png", SpacePictureCategory.OFFICE,   false, 3),
                sp("gyeonggi/hotel2/경기2주차장.png", SpacePictureCategory.AMENITY,  false, 4)
        ));
        allStays.add(createStayFull(g2, "경기 캠퍼스 디럭스룸",
                "캠퍼스 분위기의 모던 워케이션 디럭스룸",
                "IT 기업 밀집 지역에 위치해 출퇴근 없는 집중 업무 환경을 제공합니다.",
                2, 3, "Y", 140000, 180000, 215000,
                new StayOption[]{StayOption.DESK, StayOption.CITY_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.SHOWER_BOOTH},
                List.of(si("gyeonggi/hotel2/경기2스테이(디럭스룸)1.png", true,  1),
                        si("gyeonggi/hotel2/경기2스테이(디럭스룸)2.png", false, 2),
                        si("gyeonggi/hotel2/경기2스테이(디럭스룸)3.png", false, 3),
                        si("gyeonggi/hotel2/경기2스테이(디럭스룸)4.png", false, 4))));
        allStays.add(createStayFull(g2, "경기 캠퍼스 스위트룸",
                "별도 작업실을 갖춘 캠퍼스 스위트룸",
                "독립된 작업 공간과 넓은 침실이 분리되어 집중과 휴식을 균형 있게 즐길 수 있습니다.",
                2, 4, "Y", 215000, 265000, 315000,
                new StayOption[]{StayOption.DESK, StayOption.CITY_VIEW, StayOption.COFFEE_MACHINE, StayOption.BATHTUB, StayOption.REFRIGERATOR},
                List.of(si("gyeonggi/hotel2/경기2스테이(스위트룸)1.png", true,  1),
                        si("gyeonggi/hotel2/경기2스테이(스위트룸)2.png", false, 2),
                        si("gyeonggi/hotel2/경기2스테이(스위트룸)3.png", false, 3),
                        si("gyeonggi/hotel2/경기2스테이(스위트룸)4.png", false, 4),
                        si("gyeonggi/hotel2/경기2스테이(스위트룸)5.png", false, 5))));
        allStays.add(createStayFull(g2, "경기 캠퍼스 패밀리룸",
                "팀 단위 워케이션을 위한 대형 패밀리룸",
                "대형 테이블과 다수의 업무 좌석을 갖춘 팀 워케이션 최적 객실입니다.",
                3, 5, "N", 270000, 330000, 395000,
                new StayOption[]{StayOption.DESK, StayOption.CITY_VIEW, StayOption.KITCHEN, StayOption.REFRIGERATOR, StayOption.MICROWAVE},
                List.of(si("gyeonggi/hotel2/경기2스테이(패밀리룸)1.png", true,  1),
                        si("gyeonggi/hotel2/경기2스테이(패밀리룸)2.png", false, 2),
                        si("gyeonggi/hotel2/경기2스테이(패밀리룸)3.png", false, 3))));

        // ── Hotel 3: 경기 호수뷰 워케이션 리조트 ──
        SpaceEntity g3 = createSpace(seller, "경기 호수뷰 워케이션 리조트", "0311232004",
                "gyeonggi03@workation.com", "청평호 전망 힐링 워케이션 리조트",
                "청평호수 조망이 가능한 경기형 힐링 워케이션 리조트입니다.",
                "경기도 가평군 청평면 청평리", "789", Area.GYEONGGI, "37.7400000", "127.4800000");
        linkArcades(g3, arcades, 0, 6, 8, 9);
        addSpacePics(g3, List.of(
                sp("gyeonggi/hotel3/경기3외관.png",   SpacePictureCategory.EXTERIOR, true,  1),
                sp("gyeonggi/hotel3/경기3로비.png",   SpacePictureCategory.FACILITY, false, 2),
                sp("gyeonggi/hotel3/경기3오피스.png", SpacePictureCategory.OFFICE,   false, 3),
                sp("gyeonggi/hotel3/경기3주차장.png", SpacePictureCategory.AMENITY,  false, 4)
        ));
        allStays.add(createStayFull(g3, "경기 호수뷰 디럭스룸",
                "청평호 전망이 보이는 힐링 디럭스룸",
                "호수 조망과 함께 자연 속에서 집중 업무를 즐길 수 있는 객실입니다.",
                2, 3, "Y", 130000, 170000, 200000,
                new StayOption[]{StayOption.DESK, StayOption.GARDEN_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.AMENITY},
                List.of(si("gyeonggi/hotel3/경기3스테이(디럭스룸)1.png", true,  1),
                        si("gyeonggi/hotel3/경기3스테이(디럭스룸)2.png", false, 2),
                        si("gyeonggi/hotel3/경기3스테이(디럭스룸)3.png", false, 3),
                        si("gyeonggi/hotel3/경기3스테이(디럭스룸)4.png", false, 4))));
        allStays.add(createStayFull(g3, "경기 호수뷰 스위트룸",
                "테라스에서 호수를 바라보는 스위트룸",
                "넓은 테라스에서 호수를 바라보며 일과 휴식을 동시에 즐길 수 있습니다.",
                2, 4, "Y", 200000, 250000, 295000,
                new StayOption[]{StayOption.DESK, StayOption.GARDEN_VIEW, StayOption.BATHTUB, StayOption.COFFEE_MACHINE},
                List.of(si("gyeonggi/hotel3/경기3스테이(스위트룸)1.png", true,  1),
                        si("gyeonggi/hotel3/경기3스테이(스위트룸)2.png", false, 2),
                        si("gyeonggi/hotel3/경기3스테이(스위트룸)3.png", false, 3),
                        si("gyeonggi/hotel3/경기3스테이(스위트룸)4.png", false, 4),
                        si("gyeonggi/hotel3/경기3스테이(스위트룸)5.png", false, 5))));
        allStays.add(createStayFull(g3, "경기 호수뷰 패밀리룸",
                "가족 워케이션에 최적화된 호수뷰 패밀리룸",
                "취사 가능 주방과 넓은 거실을 갖춰 가족 동반 장기 체류에 좋습니다.",
                4, 6, "N", 260000, 320000, 380000,
                new StayOption[]{StayOption.DESK, StayOption.GARDEN_VIEW, StayOption.KITCHEN, StayOption.REFRIGERATOR, StayOption.COOKING_AVAILABLE, StayOption.TABLEWARE},
                List.of(si("gyeonggi/hotel3/경기3스테이(패밀리룸)1.png", true,  1),
                        si("gyeonggi/hotel3/경기3스테이(패밀리룸)2.png", false, 2),
                        si("gyeonggi/hotel3/경기3스테이(패밀리룸)3.png", false, 3))));
    }

    // ───────────────────────────────────────────────
    // 경남 (seller03) — 3개 공간, 각 3개 스테이
    // ───────────────────────────────────────────────
    private void seedGyeongnam(MemberEntity seller, List<ArcadeEntity> arcades, List<StayEntity> allStays) {

        // ── Hotel 1: 경남 오션 워케이션 호텔 ──
        SpaceEntity n1 = createSpace(seller, "경남 오션 워케이션 호텔", "0551233003",
                "gyeongnam01@workation.com", "바다 가까운 경남 오션 워케이션 호텔",
                "남해안 여행과 업무를 함께 즐길 수 있는 경남형 워케이션 숙소입니다.",
                "경상남도 거제시 장승포해안로", "303", Area.GYEONGNAM, "34.8806000", "128.6211000");
        linkArcades(n1, arcades, 0, 1, 5, 6);
        addSpacePics(n1, List.of(
                sp("gyeongnam/호텔1/경남호텔외관1.png",  SpacePictureCategory.EXTERIOR, true,  1),
                sp("gyeongnam/호텔1/경남호텔외관2.png",  SpacePictureCategory.EXTERIOR, false, 2),
                sp("gyeongnam/호텔1/경남호텔로비1.png",  SpacePictureCategory.FACILITY, false, 3),
                sp("gyeongnam/호텔1/경남호텔로비2.png",  SpacePictureCategory.FACILITY, false, 4),
                sp("gyeongnam/호텔1/경남호텔오피스1.png",SpacePictureCategory.OFFICE,   false, 5),
                sp("gyeongnam/호텔1/경남호텔주차장1.png",SpacePictureCategory.AMENITY,  false, 6)
        ));
        allStays.add(createStayFull(n1, "경남 오션 디럭스룸",
                "해안과 가까운 실속형 워케이션 디럭스룸",
                "바다 근처에서 집중 업무와 휴식을 함께 누릴 수 있는 기본형 객실입니다.",
                2, 3, "Y", 125000, 165000, 195000,
                new StayOption[]{StayOption.DESK, StayOption.OCEAN_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.AMENITY},
                List.of(si("gyeongnam/호텔1/경남호텔스테이(디럭스룸)1.png", true,  1),
                        si("gyeongnam/호텔1/경남호텔스테이(디럭스룸)2.png", false, 2),
                        si("gyeongnam/호텔1/경남호텔스테이(디럭스룸)3.png", false, 3),
                        si("gyeongnam/호텔1/경남호텔스테이(디럭스룸)4.png", false, 4))));
        allStays.add(createStayFull(n1, "경남 오션 주니어스위트룸",
                "여유 있는 침실과 업무 공간을 갖춘 주니어스위트룸",
                "넓은 객실과 업무용 좌석을 갖춰 가족 동반 워케이션에도 사용할 수 있습니다.",
                2, 4, "Y", 185000, 230000, 270000,
                new StayOption[]{StayOption.DESK, StayOption.OCEAN_VIEW, StayOption.BATHTUB, StayOption.COFFEE_MACHINE},
                List.of(si("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)1.png", true,  1),
                        si("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)2.png", false, 2),
                        si("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)3.png", false, 3),
                        si("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)4.png", false, 4),
                        si("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)5.png", false, 5))));
        allStays.add(createStayFull(n1, "경남 오션 패밀리룸",
                "바다 조망 오션 패밀리 스위트",
                "거실+침실 2개로 구성되어 가족 워케이션에 적합한 오션뷰 패밀리 스위트입니다.",
                3, 5, "Y", 230000, 285000, 340000,
                new StayOption[]{StayOption.DESK, StayOption.OCEAN_VIEW, StayOption.KITCHEN, StayOption.REFRIGERATOR, StayOption.SHOWER_BOOTH},
                List.of(si("gyeongnam/호텔1/경남호텔스테이(패밀리룸)1.png", true,  1),
                        si("gyeongnam/호텔1/경남호텔스테이(패밀리룸)2.png", false, 2),
                        si("gyeongnam/호텔1/경남호텔스테이(패밀리룸)3.png", false, 3))));

        // ── Hotel 2: 경남 남해 워케이션 빌라 ──
        SpaceEntity n2 = createSpace(seller, "경남 남해 워케이션 빌라", "0551233004",
                "gyeongnam02@workation.com", "남해 한려수도 조망 워케이션 빌라",
                "한려수도 뷰와 함께하는 남해 독채 빌라형 워케이션 공간입니다.",
                "경상남도 남해군 창선면 창선해안로", "404", Area.GYEONGNAM, "34.7500000", "128.0200000");
        linkArcades(n2, arcades, 6, 7, 8, 9);
        addSpacePics(n2, List.of(
                sp("gyeongnam/hotel2/경남2외관.png",   SpacePictureCategory.EXTERIOR, true,  1),
                sp("gyeongnam/hotel2/경남2로비.png",   SpacePictureCategory.FACILITY, false, 2),
                sp("gyeongnam/hotel2/경남2오피스.png", SpacePictureCategory.OFFICE,   false, 3),
                sp("gyeongnam/hotel2/경남2주차장.png", SpacePictureCategory.AMENITY,  false, 4)
        ));
        allStays.add(createStayFull(n2, "경남 남해 디럭스룸",
                "한려수도 조망 남해 디럭스룸",
                "남해의 맑은 바다와 다도해를 바라보며 업무에 집중할 수 있는 객실입니다.",
                2, 3, "Y", 135000, 175000, 205000,
                new StayOption[]{StayOption.DESK, StayOption.OCEAN_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.BIDET},
                List.of(si("gyeongnam/hotel2/경남2스테이(디럭스룸)1.png", true,  1),
                        si("gyeongnam/hotel2/경남2스테이(디럭스룸)2.png", false, 2),
                        si("gyeongnam/hotel2/경남2스테이(디럭스룸)3.png", false, 3),
                        si("gyeongnam/hotel2/경남2스테이(디럭스룸)4.png", false, 4))));
        allStays.add(createStayFull(n2, "경남 남해 스위트룸",
                "프라이빗 테라스와 욕조를 갖춘 남해 스위트룸",
                "독채 테라스에서 한려수도를 바라보며 완전한 휴식과 업무를 즐길 수 있습니다.",
                2, 4, "Y", 210000, 260000, 310000,
                new StayOption[]{StayOption.DESK, StayOption.OCEAN_VIEW, StayOption.BATHTUB, StayOption.COFFEE_MACHINE, StayOption.AMENITY},
                List.of(si("gyeongnam/hotel2/경남2스테이(스위트룸)1.png", true,  1),
                        si("gyeongnam/hotel2/경남2스테이(스위트룸)2.png", false, 2),
                        si("gyeongnam/hotel2/경남2스테이(스위트룸)3.png", false, 3),
                        si("gyeongnam/hotel2/경남2스테이(스위트룸)4.png", false, 4),
                        si("gyeongnam/hotel2/경남2스테이(스위트룸)5.png", false, 5))));
        allStays.add(createStayFull(n2, "경남 남해 패밀리빌라",
                "독채 빌라 전체 사용 패밀리룸",
                "빌라 전체를 독점 사용하는 형태로 가족 단위 워케이션에 최적입니다.",
                4, 6, "N", 290000, 360000, 430000,
                new StayOption[]{StayOption.DESK, StayOption.OCEAN_VIEW, StayOption.KITCHEN, StayOption.REFRIGERATOR, StayOption.COOKING_AVAILABLE},
                List.of(si("gyeongnam/hotel2/경남2스테이(패밀리룸)1.png", true,  1),
                        si("gyeongnam/hotel2/경남2스테이(패밀리룸)2.png", false, 2),
                        si("gyeongnam/hotel2/경남2스테이(패밀리룸)3.png", false, 3))));

        // ── Hotel 3: 경남 통영 마린 워케이션 ──
        SpaceEntity n3 = createSpace(seller, "경남 통영 마린 워케이션", "0551233005",
                "gyeongnam03@workation.com", "통영항 조망 마린 워케이션 호텔",
                "통영 항구의 다이나믹한 뷰와 함께하는 해양 테마 워케이션 공간입니다.",
                "경상남도 통영시 해저터널로", "505", Area.GYEONGNAM, "34.8460000", "128.4220000");
        linkArcades(n3, arcades, 0, 1, 3, 5);
        addSpacePics(n3, List.of(
                sp("gyeongnam/hotel3/경남3외관.png",   SpacePictureCategory.EXTERIOR, true,  1),
                sp("gyeongnam/hotel3/경남3로비.png",   SpacePictureCategory.FACILITY, false, 2),
                sp("gyeongnam/hotel3/경남3오피스.png", SpacePictureCategory.OFFICE,   false, 3),
                sp("gyeongnam/hotel3/경남3주차장.png", SpacePictureCategory.AMENITY,  false, 4)
        ));
        allStays.add(createStayFull(n3, "경남 통영 디럭스룸",
                "통영항 조망 마린 디럭스룸",
                "항구의 활기찬 풍경을 바라보며 집중 업무가 가능한 마린 테마 객실입니다.",
                2, 3, "Y", 145000, 185000, 220000,
                new StayOption[]{StayOption.DESK, StayOption.OCEAN_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.SHOWER_BOOTH},
                List.of(si("gyeongnam/hotel3/경남3스테이(디럭스룸)1.png", true,  1),
                        si("gyeongnam/hotel3/경남3스테이(디럭스룸)2.png", false, 2),
                        si("gyeongnam/hotel3/경남3스테이(디럭스룸)3.png", false, 3),
                        si("gyeongnam/hotel3/경남3스테이(디럭스룸)4.png", false, 4))));
        allStays.add(createStayFull(n3, "경남 통영 스위트룸",
                "통영 야경이 보이는 마린 스위트룸",
                "통영 항구 야경과 함께 프리미엄 욕조와 전용 라운지를 갖춘 스위트입니다.",
                2, 4, "Y", 220000, 275000, 330000,
                new StayOption[]{StayOption.DESK, StayOption.OCEAN_VIEW, StayOption.BATHTUB, StayOption.COFFEE_MACHINE, StayOption.REFRIGERATOR},
                List.of(si("gyeongnam/hotel3/경남3스테이(스위트룸)1.png", true,  1),
                        si("gyeongnam/hotel3/경남3스테이(스위트룸)2.png", false, 2),
                        si("gyeongnam/hotel3/경남3스테이(스위트룸)3.png", false, 3),
                        si("gyeongnam/hotel3/경남3스테이(스위트룸)4.png", false, 4),
                        si("gyeongnam/hotel3/경남3스테이(스위트룸)5.png", false, 5))));
        allStays.add(createStayFull(n3, "경남 통영 패밀리룸",
                "통영 바다를 마주한 대형 패밀리룸",
                "주방과 넓은 거실, 두 개의 침실로 구성된 가족 여행 최적 객실입니다.",
                4, 6, "N", 310000, 385000, 460000,
                new StayOption[]{StayOption.DESK, StayOption.OCEAN_VIEW, StayOption.KITCHEN, StayOption.INDUCTION, StayOption.REFRIGERATOR, StayOption.TABLEWARE},
                List.of(si("gyeongnam/hotel3/경남3스테이(패밀리룸)1.png", true,  1),
                        si("gyeongnam/hotel3/경남3스테이(패밀리룸)2.png", false, 2),
                        si("gyeongnam/hotel3/경남3스테이(패밀리룸)3.png", false, 3))));
    }

    // ───────────────────────────────────────────────
    // 예약 — stay당 7가지 상태 × 2건 = 14건씩, 총 378건
    // ───────────────────────────────────────────────
    private List<ReservationEntity> seedReservations(List<MemberEntity> users, List<StayEntity> stays) {
        List<ReservationEntity> result = new ArrayList<>();
        LocalDate today = LocalDate.now();
        int idx = 0;

        String[] guestNames  = {"홍길동", "김예약", "이결제", "박대기", "최취소", "정거절", "윤환불"};
        String[] guestPhones = {"01012341234", "01056785678", "01011112222",
                                "01033334444", "01099998888", "01077776666", "01044445555"};

        record Cfg(ReservationStatus status, LocalDate checkin, int nights) {}

        for (StayEntity stay : stays) {
            long base = stay.getMonPrice();
            // 전체 날짜 ±20일 이내, 최소 2박
            List<Cfg> cfgs = List.of(
                    new Cfg(ReservationStatus.COMPLETED,         today.minusDays(18), 2),
                    new Cfg(ReservationStatus.COMPLETED,         today.minusDays(13), 3),
                    new Cfg(ReservationStatus.COMPLETED,         today.minusDays(8),  2),
                    new Cfg(ReservationStatus.RESERVED,          today.plusDays(3),   2),
                    new Cfg(ReservationStatus.RESERVED,          today.plusDays(9),   3),
                    new Cfg(ReservationStatus.RESERVED,          today.plusDays(15),  2),
                    new Cfg(ReservationStatus.PAYMENT_COMPLETED, today.plusDays(5),   2),
                    new Cfg(ReservationStatus.PAYMENT_COMPLETED, today.plusDays(11),  3),
                    new Cfg(ReservationStatus.PAYMENT_COMPLETED, today.plusDays(17),  2),
                    new Cfg(ReservationStatus.PENDING,           today.plusDays(2),   2),
                    new Cfg(ReservationStatus.PENDING,           today.plusDays(7),   2),
                    new Cfg(ReservationStatus.PENDING,           today.plusDays(13),  3),
                    new Cfg(ReservationStatus.USER_CANCELLED,    today.minusDays(17), 2),
                    new Cfg(ReservationStatus.USER_CANCELLED,    today.minusDays(11), 2),
                    new Cfg(ReservationStatus.USER_CANCELLED,    today.minusDays(6),  2),
                    new Cfg(ReservationStatus.SELLER_CANCELLED,  today.minusDays(19), 2),
                    new Cfg(ReservationStatus.SELLER_CANCELLED,  today.minusDays(14), 3),
                    new Cfg(ReservationStatus.SELLER_CANCELLED,  today.minusDays(7),  2),
                    new Cfg(ReservationStatus.REFUND_COMPLETED,  today.minusDays(16), 2),
                    new Cfg(ReservationStatus.REFUND_COMPLETED,  today.minusDays(10), 2),
                    new Cfg(ReservationStatus.REFUND_COMPLETED,  today.minusDays(5),  3)
            );
            for (Cfg cfg : cfgs) {
                long price = base * cfg.nights();
                result.add(reservationRepository.save(ReservationEntity.builder()
                        .member(users.get(idx % users.size()))
                        .stay(stay)
                        .space(stay.getSpace())
                        .checkinDate(cfg.checkin())
                        .checkoutDate(cfg.checkin().plusDays(cfg.nights()))
                        .guestCount(2)
                        .primaryGuestName(guestNames[idx % guestNames.length])
                        .primaryGuestPhone(guestPhones[idx % guestPhones.length])
                        .primaryGuestEmail("guest" + idx + "@workation.com")
                        .originalPrice(price)
                        .discountAmount(0L)
                        .totalPrice(price)
                        .status(cfg.status())
                        .orderId("ORD-" + stay.getId() + "-" + cfg.status().name().substring(0, 3) + "-" + (++orderCounter))
                        .build()));
                idx++;
            }
        }
        return result;
    }

    // ───────────────────────────────────────────────
    // 리뷰 — COMPLETED 예약건당 1개
    // ───────────────────────────────────────────────
    private void seedReviews(List<ReservationEntity> reservations) {
        String[] titles = {
                "최고의 워케이션 경험!", "업무와 휴식을 동시에", "재방문 의사 있어요",
                "시설이 너무 좋아요", "직원 서비스 최고", "위치가 완벽합니다",
                "넓고 쾌적한 공간", "Wi-Fi 빠르고 책상 편해요"
        };
        String[] tags = {
                "#워케이션추천", "#재방문확정", "#힐링", "#업무효율UP",
                "#가족여행", "#혼자여행", "#팀워크", "#집중력강화"
        };
        String body = "업무 환경이 잘 갖춰져 있고 주변 경관도 아름다워 집중이 잘 됐습니다. "
                + "체크인부터 체크아웃까지 불편함 없이 이용했으며 특히 조식이 훌륭했습니다. "
                + "다음에 또 방문하고 싶은 워케이션 공간이었습니다.";

        List<ReservationEntity> completed = reservations.stream()
                .filter(r -> r.getStatus() == ReservationStatus.COMPLETED)
                .toList();

        for (int i = 0; i < completed.size(); i++) {
            ReservationEntity resv = completed.get(i);

            // 💡 핵심 수정: 예약(resv)을 통해 공간(SpaceEntity) 정보를 가져와서 Review에 매핑
            reviewRepository.save(ReviewEntity.builder()
                    .member(resv.getMember())
                    .reservation(resv)
                    .space(resv.getSpace()) // 💡 이 코드가 누락되어 null 오류가 발생했던 것입니다.
                    .title(titles[i % titles.length])
                    .content(body)
                    .tag(tags[i % tags.length])
                    .rating(4 + (i % 2))
                    .build());
        }
    }

    // ───────────────────────────────────────────────
    // FAQ — 20개
    // ───────────────────────────────────────────────
    private void seedFaqs(MemberEntity admin) {
        if (faqRepository.count() > 0) return;
        List<String[]> list = List.of(
                new String[]{"예약은 어떻게 하나요?",
                        "홈페이지에서 원하는 공간을 선택하고, 날짜와 인원수를 입력한 후 결제를 완료하시면 예약이 확정됩니다."},
                new String[]{"취소 및 환불 정책은 어떻게 되나요?",
                        "체크인 7일 전까지 취소 시 전액 환불, 3~7일 전 50% 환불, 3일 이내 취소 시 환불 불가입니다."},
                new String[]{"워케이션과 일반 숙박의 차이는 무엇인가요?",
                        "워케이션 객실은 업무용 책상, 고속 Wi-Fi, 호텔 내 공유 오피스 공간이 무료로 포함됩니다."},
                new String[]{"회원가입은 어떻게 하나요?",
                        "상단 메뉴의 [회원가입] 버튼을 클릭하여 이름, 이메일, 비밀번호를 입력하면 가입이 완료됩니다."},
                new String[]{"쿠폰은 어디서 사용하나요?",
                        "예약 결제 단계에서 보유 쿠폰을 선택하시면 할인이 적용됩니다."},
                new String[]{"셀러(공간 제공자)로 등록하려면 어떻게 해야 하나요?",
                        "마이페이지 > 셀러 신청 메뉴에서 사업자 정보와 계좌 정보를 입력하고 신청하시면 검토 후 셀러 권한이 부여됩니다."},
                new String[]{"결제 수단은 무엇을 지원하나요?",
                        "신용카드, 체크카드, 카카오페이, 네이버페이, 토스페이 등 다양한 결제 수단을 지원합니다."},
                new String[]{"체크인/체크아웃 시간은 어떻게 되나요?",
                        "기본 체크인 시간은 오후 3시, 체크아웃 시간은 오전 11시입니다. 공간마다 상이할 수 있으니 상세 페이지를 확인해 주세요."},
                new String[]{"예약 확인은 어떻게 하나요?",
                        "마이페이지 > 예약 내역 메뉴에서 모든 예약 현황을 확인하실 수 있습니다."},
                new String[]{"리뷰는 언제 작성할 수 있나요?",
                        "이용 완료(체크아웃) 후 마이페이지 > 예약 내역에서 리뷰 작성이 가능합니다."},
                new String[]{"분실물 신고는 어떻게 하나요?",
                        "고객센터(1588-0000)로 연락주시거나, 이용하신 공간에 직접 문의해 주세요."},
                new String[]{"유아/어린이 동반이 가능한가요?",
                        "공간마다 정책이 다릅니다. 공간 상세 페이지의 이용 조건을 확인해 주세요."},
                new String[]{"반려동물 동반이 가능한가요?",
                        "반려동물 동반은 원칙적으로 불가능합니다. 단, 펫 프렌들리 공간으로 등록된 숙소는 가능합니다."},
                new String[]{"Wi-Fi는 무료로 제공되나요?",
                        "모든 워케이션 공간에서 고속 무료 Wi-Fi를 제공합니다."},
                new String[]{"주차 공간은 있나요?",
                        "대부분의 공간에서 무료 주차를 지원합니다. 공간 상세 페이지에서 주차 여부를 확인해 주세요."},
                new String[]{"조식 서비스는 제공되나요?",
                        "공간에 따라 조식 포함 여부가 다릅니다. 예약 전 상세 페이지에서 확인해 주세요."},
                new String[]{"비즈니스 영수증(세금계산서) 발급이 가능한가요?",
                        "법인 카드 결제 시 세금계산서 발급이 가능합니다. 고객센터로 문의해 주세요."},
                new String[]{"예약 후 날짜 변경이 가능한가요?",
                        "체크인 7일 전까지는 마이페이지에서 날짜 변경이 가능합니다. 그 이후에는 취소 후 재예약을 해야 합니다."},
                new String[]{"공간 등록 심사는 얼마나 걸리나요?",
                        "공간 등록 신청 후 영업일 기준 3~5일 내 심사 결과를 안내드립니다."},
                new String[]{"결제 오류가 발생했어요. 어떻게 해야 하나요?",
                        "결제 화면에서 오류 발생 시 카드사 또는 고객센터(1588-0000)로 문의해 주세요. 이중 결제 여부도 확인해 드립니다."}
        );
        list.forEach(qa -> faqRepository.save(
                FaqEntity.builder().member(admin).question(qa[0]).answer(qa[1]).build()));
    }

    // ───────────────────────────────────────────────
    // 공지사항 — 20개
    // ───────────────────────────────────────────────
    private void seedNotices(MemberEntity admin) {
        if (noticeRepository.count() > 0) return;
        List<String[]> list = List.of(
                new String[]{"Y", "Workation 서비스 오픈 안내",
                        "워케이션 통합 예약 플랫폼 정식 서비스를 시작합니다. 코워킹 스페이스와 숙박을 한 번에 예약하세요!"},
                new String[]{"Y", "신규 가입 혜택 안내 (웰컴 쿠폰 10% 할인)",
                        "신규 회원 가입 시 자동으로 10% 할인 웰컴 쿠폰이 지급됩니다. 유효기간 7일이니 빠르게 사용하세요."},
                new String[]{"N", "[점검] 2026년 6월 7일(일) 새벽 2시~4시 서비스 점검",
                        "서비스 안정화 작업으로 인해 해당 시간 동안 예약 서비스가 일시 중단됩니다."},
                new String[]{"N", "결제 시스템 개선 — 네이버페이·토스페이 추가",
                        "더욱 빠르고 안전한 결제를 위해 결제 시스템을 개선하였습니다."},
                new String[]{"N", "셀러(공간 제공자) 모집 안내",
                        "워케이션 공간을 보유하고 계신 사업자를 모집합니다. 셀러 신청 후 심사를 통해 공간을 등록해 보세요!"},
                new String[]{"N", "여름 시즌 특별 프로모션 — 강원도 15% 할인",
                        "7월~8월 여름 시즌을 맞아 강원도 워케이션 패키지 15% 할인 프로모션을 진행합니다."},
                new String[]{"N", "리뷰 이벤트 — 베스트 리뷰 선정",
                        "이달의 베스트 리뷰 작성자를 선정합니다. 상위 10명에게 5만원 할인 쿠폰을 드립니다."},
                new String[]{"N", "모바일 앱 출시 예정 (2026년 8월)",
                        "워케이션 모바일 앱이 2026년 8월 출시 예정입니다. 앱 스토어에서 사전 알림을 신청해 주세요."},
                new String[]{"N", "개인정보 처리방침 개정 안내 (2026.06.01)",
                        "개인정보 처리방침이 개정되었습니다. 변경 내용을 확인해 주시기 바랍니다."},
                new String[]{"N", "워케이션 추천 지역 — 강원도 속초",
                        "강원도 속초는 바다와 산이 공존하는 워케이션 최적지입니다. 이번 주 특가 상품을 확인해 보세요."},
                new String[]{"N", "법인 단체 예약 서비스 오픈",
                        "법인 고객을 위한 단체 예약 서비스가 오픈되었습니다. 5인 이상 단체 예약 시 추가 혜택을 드립니다."},
                new String[]{"N", "공간 환경 사진 업데이트 안내",
                        "등록된 공간의 최신 사진으로 업데이트되었습니다. 더욱 생생한 공간 정보를 확인해 보세요."},
                new String[]{"N", "취소/환불 정책 개정 안내",
                        "2026년 6월 1일부터 취소 및 환불 정책이 일부 변경됩니다. 예약 전 반드시 확인해 주세요."},
                new String[]{"N", "워케이션 트렌드 리포트 2026 발표",
                        "2026 워케이션 트렌드 리포트를 공개합니다. 올해 가장 인기 있는 워케이션 지역과 스타일을 확인해 보세요."},
                new String[]{"N", "제주도 워케이션 특가 상품 출시",
                        "제주도 워케이션 특가 패키지가 출시되었습니다. 7월 말 이전 예약 시 20% 추가 할인 혜택이 제공됩니다."},
                new String[]{"N", "생일 쿠폰 서비스 시작",
                        "회원 생일에 특별한 20% 할인 생일 쿠폰을 드립니다. 생년월일을 등록하고 혜택을 받아보세요!"},
                new String[]{"N", "고객센터 운영 시간 변경 안내",
                        "고객센터 운영 시간이 평일 오전 9시~오후 6시로 변경됩니다. (기존: 오전 10시~오후 5시)"},
                new String[]{"N", "워케이션 후기 공모전 개최",
                        "나의 워케이션 경험을 공유해주세요. 채택된 후기에는 최대 10만원 상품권을 드립니다."},
                new String[]{"N", "새로운 파트너 공간 추가 — 경기권 확대",
                        "경기도 수원, 광교, 판교 지역 워케이션 공간이 새롭게 추가되었습니다."},
                new String[]{"N", "워케이션 정기 이용권 출시 예정",
                        "월 단위로 워케이션 공간을 이용할 수 있는 정기 이용권 서비스가 2026년 하반기 출시 예정입니다."}
        );
        list.forEach(n -> noticeRepository.save(
                NoticeEntity.builder().member(admin).pinYn(n[0]).title(n[1]).content(n[2]).build()));
    }

    // ───────────────────────────────────────────────
    // 헬퍼 메서드
    // ───────────────────────────────────────────────
    private record SpaceImgInfo(String path, SpacePictureCategory category, String mainYn, int order) {}
    private record StayImgInfo(String path, String mainYn, int order) {}

    private SpaceImgInfo sp(String p, SpacePictureCategory cat, boolean main, int ord) {
        return new SpaceImgInfo(p, cat, main ? "Y" : "N", ord);
    }

    private StayImgInfo si(String p, boolean main, int ord) {
        return new StayImgInfo(p, main ? "Y" : "N", ord);
    }

    private String resolveImageUrl(String resourcePath) {
        try {
            ClassPathResource res = new ClassPathResource("static/dummy-images/" + resourcePath);
            if (res.exists()) {
                String filename = resourcePath.contains("/")
                        ? resourcePath.substring(resourcePath.lastIndexOf('/') + 1) : resourcePath;
                String url = s3PictureUploader.uploadFromStream(res.getInputStream(), filename, "dummy");
                if (url != null) return url;
            }
        } catch (Exception e) {
            log.warn("[DataInitializer] S3 업로드 실패, static fallback 사용: {}", resourcePath);
        }
        return IMG + "/" + resourcePath;
    }

    private static String fname(String path) {
        int i = path.lastIndexOf('/');
        return i < 0 ? path : path.substring(i + 1);
    }

    private MemberEntity createMember(String username, String pw, Role role,
                                       String name, String phone, String email) {
        MemberEntity m = memberRepository.save(MemberEntity.builder()
                .username(username).password(passwordEncoder.encode(pw))
                .roleSet(new HashSet<>(Collections.singleton(role))).build());
        profileRepository.save(MemberProfileEntity.builder()
                .member(m).name(name).phone(phone).email(email).build());
        return m;
    }

    private MemberEntity createSeller(String username, String pw, String name,
                                       String phone, String email, BankEntity bank,
                                       String bizNo, String account, String accountName, String companyName) {
        // 1단계: USER로 가입 (MemberProfileEntity 포함)
        MemberEntity m = createMember(username, pw, Role.USER, name, phone, email);
        // 2단계: SELLER로 승격 — roleSet 교체 후 저장
        m.getRoleSet().clear();
        m.getRoleSet().add(Role.SELLER);
        memberRepository.save(m);
        sellerRepository.save(SellerEntity.builder()
                .member(m).bank(bank).businessNo(bizNo)
                .account(account).accountName(accountName).companyName(companyName).build());
        return m;
    }

    private SpaceEntity createSpace(MemberEntity seller, String name, String phone, String email,
                                     String summary, String desc, String addr1, String addr2,
                                     Area area, String lat, String lng) {
        return spaceRepository.save(SpaceEntity.builder()
                .seller(seller).name(name).phone(phone).email(email)
                .summary(summary).description(desc).address1(addr1).address2(addr2).area(area)
                .latitude(new BigDecimal(lat)).longitude(new BigDecimal(lng))
                .visibleYn("Y").approvalStatus(SpaceApprovalStatus.APPROVED).build());
    }

    private StayEntity createStayFull(SpaceEntity space, String name, String summary, String desc,
                                       int capacity, int maxCapa, String workationYn,
                                       int weekday, int friSun, int satHoliday,
                                       StayOption[] options, List<StayImgInfo> imgs) {
        StayEntity stay = stayRepository.save(StayEntity.builder()
                .space(space).name(name).summary(summary).description(desc)
                .capacity(capacity).maxCapa(maxCapa)
                .checkInTime(LocalTime.of(15, 0)).checkOutTime(LocalTime.of(11, 0))
                .monPrice(weekday).tuePrice(weekday).wedPrice(weekday).thuPrice(weekday)
                .friPrice(friSun).satPrice(satHoliday).sunPrice(friSun).holidayPrice(satHoliday)
                .workationYn(workationYn).build());
        stayOptionRepository.saveAll(Arrays.stream(options)
                .map(o -> StayOptionEntity.builder().stay(stay).stayOption(o).build()).toList());
        addStayPics(stay, imgs);
        return stay;
    }

    private void addSpacePics(SpaceEntity space, List<SpaceImgInfo> imgs) {
        spacePictureRepository.saveAll(imgs.stream()
                .map(img -> SpacePictureEntity.builder()
                        .space(space)
                        .filePath(resolveImageUrl(img.path()))
                        .originName(fname(img.path()))
                        .storedName(fname(img.path()))
                        .mainYn(img.mainYn())
                        .sortOrder(img.order())
                        .category(img.category())
                        .contentType("image/png")
                        .fileSize(0L)
                        .build())
                .toList());
    }

    private void addStayPics(StayEntity stay, List<StayImgInfo> imgs) {
        stayPictureRepository.saveAll(imgs.stream()
                .map(img -> StayPictureEntity.builder()
                        .stay(stay)
                        .filePath(resolveImageUrl(img.path()))
                        .originName(fname(img.path()))
                        .storedName(fname(img.path()))
                        .mainYn(img.mainYn())
                        .sortOrder(img.order())
                        .contentType("image/png")
                        .fileSize(0L)
                        .build())
                .toList());
    }

    private void linkArcades(SpaceEntity space, List<ArcadeEntity> arcades, int... indices) {
        for (int i : indices) {
            spaceArcadeRepository.save(
                    SpaceArcadeEntity.builder().space(space).arcade(arcades.get(i)).build());
        }
    }

    // ───────────────────────────────────────────────
    // 결제 + 매출 + 환불
    // ───────────────────────────────────────────────
    private void seedPaymentsAndSales(List<ReservationEntity> reservations) {
        Set<ReservationStatus> paidStatuses = Set.of(
                ReservationStatus.COMPLETED,
                ReservationStatus.RESERVED,
                ReservationStatus.PAYMENT_COMPLETED,
                ReservationStatus.REFUND_COMPLETED
        );
        String[] cardCompanies = {"신한카드", "국민카드", "현대카드", "삼성카드", "롯데카드"};

        int pc = 0;
        for (ReservationEntity resv : reservations) {
            if (!paidStatuses.contains(resv.getStatus())) continue;

            boolean isRefunded = resv.getStatus() == ReservationStatus.REFUND_COMPLETED;
            LocalDateTime approvedAt = resv.getCheckinDate().minusDays(7).atTime(10, 30);

            ++pc;
            PaymentEntity payment = new PaymentEntity();
            payment.setReservation(resv);
            payment.setOrderId(resv.getOrderId());
            payment.setPaymentKey("PAY-KEY-" + String.format("%05d", pc));
            payment.setAmount(resv.getTotalPrice());
            payment.setCancelAmount(isRefunded ? resv.getTotalPrice() : 0L);
            payment.setPaymentMethod(PaymentMethod.CARD);
            payment.setStatus(isRefunded ? PaymentStatus.REFUNDED : PaymentStatus.SUCCESS);
            payment.setCardCompany(cardCompanies[pc % cardCompanies.length]);
            payment.setCardNumber("1234-****-****-" + String.format("%04d", pc % 10000));
            payment.setApprovedAt(approvedAt);
            payment.setCanceledAt(isRefunded ? approvedAt.plusDays(1) : null);
            payment = paymentRepository.save(payment);

            salesRepository.save(SalesEntity.builder()
                    .payment(payment)
                    .salesAmount(resv.getTotalPrice())
                    .cancelAmount(isRefunded ? resv.getTotalPrice() : 0L)
                    .netSalesAmount(isRefunded ? 0L : resv.getTotalPrice())
                    .salesDate(approvedAt)
                    .build());

            if (isRefunded) {
                refundRepository.save(RefundEntity.builder()
                        .reservation(resv)
                        .transactionKey("REFUND-" + String.format("%05d", pc))
                        .refundAmount(resv.getTotalPrice())
                        .refundReason(RefundReason.SIMPLE_CHANGE)
                        .refundedAt(approvedAt.plusDays(2))
                        .build());
            }
        }
        log.info("[DataInitializer] 결제 {}건, 환불 {}건 삽입 완료", pc,
                reservations.stream().filter(r -> r.getStatus() == ReservationStatus.REFUND_COMPLETED).count());
    }

    // ───────────────────────────────────────────────
    // 정산(Payout) + 세금계산서(TaxInvoice)
    // ───────────────────────────────────────────────
    private void seedPayoutsAndInvoices() {
        List<SalesEntity> allSales = salesRepository.findAll();
        int invNo = 0;
        LocalDate today = LocalDate.now();

        for (SalesEntity sale : allSales) {
            // 판매자 추출: sale → payment → reservation → stay → space → seller
            MemberEntity seller;
            try {
                seller = sale.getPayment().getReservation().getStay().getSpace().getSeller();
            } catch (Exception e) {
                continue;
            }
            if (seller == null) continue;

            long orig   = sale.getSalesAmount();
            long fee    = (long) (orig * 0.1);   // 10% 플랫폼 수수료
            long payout = orig - fee;

            // 순매출 > 0 인 건 = 실제 매출 발생 → COMPLETED 정산
            boolean completed = sale.getNetSalesAmount() > 0;

            // 정산일 = 매출 발생월 다음달 10일 09:00
            LocalDateTime payoutDate = completed
                    ? sale.getSalesDate().toLocalDate()
                            .plusMonths(1).withDayOfMonth(10).atTime(9, 0)
                    : null;

            PayoutEntity p = payoutRepository.save(PayoutEntity.builder()
                    .seller(seller)
                    .sales(sale)
                    .originalAmount(orig)
                    .feeAmount(fee)
                    .payoutAmount(payout)
                    .status(completed ? PayoutStatus.COMPLETED : PayoutStatus.READY)
                    .payoutDate(payoutDate)
                    .build());

            // COMPLETED 정산만 세금계산서 발행
            if (completed) {
                long supply = (long) (payout / 1.1);        // 공급가액 (부가세 역산)
                long tax    = payout - supply;               // 부가세
                String issueNo = String.format("INV-%s-%04d",
                        today.toString().replace("-", ""), ++invNo);

                taxInvoiceRepository.save(TaxInvoiceEntity.builder()
                        .issueNo(issueNo)
                        .payout(p)
                        .seller(seller)
                        .supplyValue(supply)
                        .taxAmount(tax)
                        .totalAmount(payout)
                        .issuedAt(payoutDate)
                        .build());
            }
        }
        log.info("[DataInitializer] 정산 {}건, 세금계산서 {}건 삽입 완료",
                payoutRepository.count(), taxInvoiceRepository.count());
    }

    // ───────────────────────────────────────────────
    // 과거 1년치 월별 매출/정산 더미 (2025.06 ~ 2026.05)
    // 셀러 3명 × 12개월 = 36건, 정산일은 다음달 10일 → 연도 경계 포함
    // ───────────────────────────────────────────────
    private void seedHistoricalSalesAndPayouts(List<MemberEntity> sellers, List<MemberEntity> users, List<StayEntity> allStays) {
        // 각 셀러의 대표 스테이 (강원 idx=0, 경기 idx=9, 경남 idx=18)
        StayEntity[] repStays = {
            allStays.get(0),
            allStays.get(9),
            allStays.get(18)
        };
        String[] cardCompanies = {"신한카드", "국민카드", "현대카드"};
        int histCounter = 0;
        int histInvNo = 0;

        for (int m = 0; m < 12; m++) {
            LocalDate month = LocalDate.of(2025, 6, 1).plusMonths(m);
            LocalDate checkIn = month.withDayOfMonth(12);
            LocalDate checkOut = checkIn.plusDays(2);
            LocalDateTime approvedAt = checkIn.minusDays(5).atTime(14, 0);

            for (int si = 0; si < sellers.size(); si++) {
                MemberEntity seller = sellers.get(si);
                StayEntity stay = repStays[si];
                MemberEntity user = users.get(si % users.size());
                long price = (long) stay.getMonPrice() * 2;

                ++histCounter;
                String orderId = String.format("HIST-%d-%d%02d-%04d",
                        si + 1, month.getYear(), month.getMonthValue(), histCounter);

                ReservationEntity resv = reservationRepository.save(ReservationEntity.builder()
                        .member(user).stay(stay).space(stay.getSpace())
                        .checkinDate(checkIn).checkoutDate(checkOut)
                        .guestCount(2)
                        .primaryGuestName("이용자" + histCounter)
                        .primaryGuestPhone("01099990000")
                        .primaryGuestEmail("hist" + histCounter + "@workation.com")
                        .originalPrice(price).discountAmount(0L).totalPrice(price)
                        .status(ReservationStatus.COMPLETED)
                        .orderId(orderId)
                        .build());

                PaymentEntity payment = new PaymentEntity();
                payment.setReservation(resv);
                payment.setOrderId(orderId);
                payment.setPaymentKey("HIST-PK-" + String.format("%05d", histCounter));
                payment.setAmount(price);
                payment.setCancelAmount(0L);
                payment.setPaymentMethod(PaymentMethod.CARD);
                payment.setStatus(PaymentStatus.SUCCESS);
                payment.setCardCompany(cardCompanies[histCounter % cardCompanies.length]);
                payment.setCardNumber("5678-****-****-" + String.format("%04d", histCounter % 10000));
                payment.setApprovedAt(approvedAt);
                payment = paymentRepository.save(payment);

                SalesEntity sales = salesRepository.save(SalesEntity.builder()
                        .payment(payment)
                        .salesAmount(price).cancelAmount(0L).netSalesAmount(price)
                        .salesDate(approvedAt)
                        .build());

                long fee = (long) (price * 0.1);
                long payoutAmount = price - fee;
                LocalDateTime payoutDate = month.plusMonths(1).withDayOfMonth(10).atTime(9, 0);

                PayoutEntity payout = payoutRepository.save(PayoutEntity.builder()
                        .seller(seller).sales(sales)
                        .originalAmount(price).feeAmount(fee).payoutAmount(payoutAmount)
                        .status(PayoutStatus.COMPLETED)
                        .payoutDate(payoutDate)
                        .build());

                long supply = (long) (payoutAmount / 1.1);
                long tax = payoutAmount - supply;
                String issueNo = String.format("HINV-%d%02d-%04d",
                        month.getYear(), month.getMonthValue(), ++histInvNo);

                taxInvoiceRepository.save(TaxInvoiceEntity.builder()
                        .issueNo(issueNo).payout(payout).seller(seller)
                        .supplyValue(supply).taxAmount(tax).totalAmount(payoutAmount)
                        .issuedAt(payoutDate)
                        .build());
            }
        }
        log.info("[DataInitializer] 과거 매출/정산 더미 {}건 삽입 완료", histCounter);
    }

    // ───────────────────────────────────────────────
    // 쿠폰 발급 — user01~03 각각 WELCOME-10 발급
    // ───────────────────────────────────────────────
    private void seedMemberCoupons(List<MemberEntity> users) {
        couponRepository.findByCouponCode("WELCOME-10").ifPresent(coupon -> {
            LocalDateTime expiredAt = LocalDateTime.now().plusDays(7);
            users.forEach(user -> memberCouponRepository.save(
                    MemberCouponEntity.builder()
                            .member(user)
                            .couponId(coupon)
                            .usedYn("N")
                            .expiredYn("N")
                            .expiredAt(expiredAt)
                            .build()));
        });
    }

    // ───────────────────────────────────────────────
    // 찜 — user01: 공간1~3, user02: 공간4~6, user03: 공간7~9
    // ───────────────────────────────────────────────
    private void seedWishlists(List<MemberEntity> users, List<SpaceEntity> spaces) {
        for (int u = 0; u < users.size(); u++) {
            MemberEntity user = users.get(u);
            for (int s = 0; s < 3; s++) {
                int spaceIdx = (u * 3 + s) % spaces.size();
                wishlistRepository.save(WishlistEntity.builder()
                        .member(user)
                        .space(spaces.get(spaceIdx))
                        .build());
            }
        }
    }
}
