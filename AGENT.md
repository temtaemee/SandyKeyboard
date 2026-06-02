# Workation 더미 데이터 생성 가이드

> Claude Code가 이 파일을 읽고 순서대로 작업을 수행한다.
> 반드시 Phase 순서를 지키고, 각 TODO 완료 시 체크박스를 업데이트한다.

---

## 아키텍처 결정 — 단일 통합 DataInitializer

기존에 도메인별로 분산된 Init 클래스들을 **하나의 통합 DataInitializer**로 통합한다.

### 새 파일 위치 (작성 가능)

```
workation/back/src/main/java/com/kh/app/DataInitializer.java   ← 신규 작성
```

### 기존 파일 — 삭제 필요 (직접 삭제 불가, 아래 섹션에서 위치와 방법 안내)

| 파일 | 이유 |
|------|------|
| `com/kh/app/product/DataInitializer.java` | 신규 통합 파일로 대체 |
| `com/kh/app/middle/CouponInit.java` | 신규 통합 파일로 흡수 |
| `com/kh/app/company/CompanyInit.java` | 신규 통합 파일로 흡수 |

> 삭제 방법은 아래 **"product 외부 파일 변경 안내"** 섹션 참고.

---

## 현재 DataInitializer 상태 (작업 전 기준)

| 항목 | 현재 | 목표 |
|------|------|------|
| admin 계정 | 1개 (admin/1234) | 유지 |
| user 계정 | 2개 (user01~02) | 3개 (user03 추가) |
| seller 계정 | 3개 (seller01~03) | 유지 |
| space | seller당 1개 (총 3개) | seller당 3개 (총 9개) |
| stay | space당 2개 (총 6개) | space당 3개 (총 27개) |
| 예약 | 없음 | stay당 상태값별 2개 (총 378건) |
| 쿠폰 | 신규가입 쿠폰 1개 | 생일 쿠폰 추가 |
| 리뷰 | 없음 | COMPLETED 예약건당 1개 |
| FAQ | 없음 | 20개 |
| 공지사항 | 없음 | 20개 |

---

## 전체 공간/스테이 설계

### Seller01 (강원) — Area.GANGWON

| 공간 | 폴더 | 테마 |
|------|------|------|
| 강원 포레스트 워케이션 호텔 | `gangwon/hotel1/` | 숲·산, 그린 톤 (이미지 완비) |
| 강원 계곡 워케이션 빌라 | `gangwon/hotel2/` | 계곡·물, 블루-그린 톤 (이미지 완비) |
| 강원 스노우 워케이션 리조트 | `gangwon/hotel3/` | 스키·설산, 화이트-블루 톤 (이미지 완비) |

### Seller02 (경기) — Area.GYEONGGI

| 공간 | 폴더 | 테마 |
|------|------|------|
| 경기 비즈니스 워케이션 호텔 | `gyeonggi/호텔1/` | 도심·비즈니스, 그레이 (이미지 완비) |
| 경기 캠퍼스 워케이션 스위트 | `gyeonggi/hotel2/` | 캠퍼스·모던, 베이지 톤 **(이미지 없음)** |
| 경기 호수뷰 워케이션 리조트 | `gyeonggi/hotel3/` | 호수·자연, 민트-그린 톤 **(이미지 없음)** |

### Seller03 (경남) — Area.GYEONGNAM

| 공간 | 폴더 | 테마 |
|------|------|------|
| 경남 오션 워케이션 호텔 | `gyeongnam/호텔1/` | 바다·오션뷰, 네이비 (이미지 완비) |
| 경남 남해 워케이션 빌라 | `gyeongnam/hotel2/` | 남해·섬, 테라코타-베이지 **(이미지 없음)** |
| 경남 통영 마린 워케이션 | `gyeongnam/hotel3/` | 항구·해양, 딥블루-실버 **(이미지 없음)** |

---

## Phase 1: 이미지 생성

> 이미지가 없어도 서버는 뜨지만 UI에서 깨진 이미지가 보이므로 DataInitializer 코드 작성 전에 먼저 준비한다.

### 1-1. 이미지 생성 방법 (Python + Pillow)

```python
# generate_dummy_images.py — 위치: d:/dev/finalPrj/generate_dummy_images.py
# 실행: python generate_dummy_images.py
# 의존성: pip install Pillow

from PIL import Image, ImageDraw
import os

BASE = r"workation/back/src/main/resources/static/dummy-images"

THEMES = {
    "gangwon1":  {"bg": (27, 94, 32),   "accent": (200, 230, 201), "label": "강원 포레스트"},
    "gangwon2":  {"bg": (0, 96, 100),   "accent": (178, 235, 242), "label": "강원 계곡"},
    "gangwon3":  {"bg": (13, 71, 161),  "accent": (227, 242, 253), "label": "강원 스노우"},
    "gyeonggi1": {"bg": (66, 66, 66),   "accent": (238, 238, 238), "label": "경기 비즈니스"},
    "gyeonggi2": {"bg": (121, 85, 72),  "accent": (245, 235, 230), "label": "경기 캠퍼스"},
    "gyeonggi3": {"bg": (0, 121, 107),  "accent": (224, 242, 241), "label": "경기 호수뷰"},
    "gyeongnam1":{"bg": (21, 101, 192), "accent": (227, 242, 253), "label": "경남 오션"},
    "gyeongnam2":{"bg": (183, 84, 44),  "accent": (255, 243, 224), "label": "경남 남해"},
    "gyeongnam3":{"bg": (13, 60, 97),   "accent": (176, 210, 240), "label": "경남 통영"},
}

def make(path, image_type, theme_key, size=(1200, 800)):
    t = THEMES[theme_key]
    img = Image.new("RGB", size, color=t["bg"])
    draw = ImageDraw.Draw(img)
    bw, bh = size[0] * 0.5, size[1] * 0.25
    bx, by = (size[0] - bw) / 2, (size[1] - bh) / 2
    draw.rectangle([bx, by, bx + bw, by + bh], fill=t["accent"])
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path)
    print(f"생성: {path}")

# 호텔 패밀리룸 stay 이미지 (기존 공간, 3번째 스테이 추가용)
for hotel, folder, prefix, tk in [
    ("hotel1", "gangwon/hotel1",   "강원1",   "gangwon1"),
    ("hotel2", "gangwon/hotel2",   "강원2",   "gangwon2"),
    ("hotel3", "gangwon/hotel3",   "강원3",   "gangwon3"),
    ("hotel1", "gyeonggi/호텔1",   "경기호텔","gyeonggi1"),
    ("hotel1", "gyeongnam/호텔1",  "경남호텔","gyeongnam1"),
]:
    for i in range(1, 4):
        make(f"{BASE}/{folder}/{prefix}스테이(패밀리룸){i}.png", f"패밀리룸{i}", tk)

# 경기 hotel2 전체
for img_type, fname in [("외관","경기2외관"), ("로비","경기2로비"),
                         ("오피스","경기2오피스"), ("주차장","경기2주차장")]:
    make(f"{BASE}/gyeonggi/hotel2/{fname}.png", img_type, "gyeonggi2")
for stype, cnt in [("디럭스룸", 4), ("스위트룸", 5), ("패밀리룸", 3)]:
    for i in range(1, cnt + 1):
        make(f"{BASE}/gyeonggi/hotel2/경기2스테이({stype}){i}.png", f"{stype}{i}", "gyeonggi2")

# 경기 hotel3 전체
for img_type, fname in [("외관","경기3외관"), ("로비","경기3로비"),
                         ("오피스","경기3오피스"), ("주차장","경기3주차장")]:
    make(f"{BASE}/gyeonggi/hotel3/{fname}.png", img_type, "gyeonggi3")
for stype, cnt in [("디럭스룸", 4), ("스위트룸", 5), ("패밀리룸", 3)]:
    for i in range(1, cnt + 1):
        make(f"{BASE}/gyeonggi/hotel3/경기3스테이({stype}){i}.png", f"{stype}{i}", "gyeonggi3")

# 경남 hotel2 전체
for img_type, fname in [("외관","경남2외관"), ("로비","경남2로비"),
                         ("오피스","경남2오피스"), ("주차장","경남2주차장")]:
    make(f"{BASE}/gyeongnam/hotel2/{fname}.png", img_type, "gyeongnam2")
for stype, cnt in [("디럭스룸", 4), ("스위트룸", 5), ("패밀리룸", 3)]:
    for i in range(1, cnt + 1):
        make(f"{BASE}/gyeongnam/hotel2/경남2스테이({stype}){i}.png", f"{stype}{i}", "gyeongnam2")

# 경남 hotel3 전체
for img_type, fname in [("외관","경남3외관"), ("로비","경남3로비"),
                         ("오피스","경남3오피스"), ("주차장","경남3주차장")]:
    make(f"{BASE}/gyeongnam/hotel3/{fname}.png", img_type, "gyeongnam3")
for stype, cnt in [("디럭스룸", 4), ("스위트룸", 5), ("패밀리룸", 3)]:
    for i in range(1, cnt + 1):
        make(f"{BASE}/gyeongnam/hotel3/경남3스테이({stype}){i}.png", f"{stype}{i}", "gyeongnam3")

print("완료. 총 이미지:", 15 + 16 + 16 + 16 + 16, "장")
```

### 1-2. 생성 필요 이미지 수 요약

| 구분 | 파일 수 |
|------|---------|
| 기존 5개 공간 패밀리룸 stay 이미지 (각 3장) | 15장 |
| 경기 hotel2 전체 (공간 4 + stay 3타입 12) | 16장 |
| 경기 hotel3 전체 | 16장 |
| 경남 hotel2 전체 | 16장 |
| 경남 hotel3 전체 | 16장 |
| **합계** | **79장** |

### 1-3. 이미지 생성 실행 절차

```
1. pip install Pillow
2. python generate_dummy_images.py
3. 결과 확인: ls workation/back/src/main/resources/static/dummy-images/gyeonggi/hotel2/
4. (선택) 실제 호텔 사진으로 동일 파일명으로 교체
5. 서버 재시작 → DataInitializer가 S3 업로드 또는 static 경로로 참조
```

---

## Phase 2: 통합 DataInitializer.java 신규 작성

**파일 위치 (신규 작성):**
```
workation/back/src/main/java/com/kh/app/DataInitializer.java
```

**패키지 선언:**
```java
package com.kh.app;
```

### 2-1. [ ] 전체 Import 목록

```java
// Spring
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.core.io.ClassPathResource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// Member
import com.kh.app.member.entity.*;
import com.kh.app.member.repository.*;

// Company
import com.kh.app.company.entity.CompanyEntity;
import com.kh.app.company.repository.CompanyRepository;

// Product - Space
import com.kh.app.product.space.entity.*;
import com.kh.app.product.space.repository.*;

// Product - Stay
import com.kh.app.product.stay.entity.*;
import com.kh.app.product.stay.repository.*;

// Product - Common
import com.kh.app.product.common.util.S3PictureUploader;

// Transaction - Reservation
import com.kh.app.transaction.reservation.entity.*;
import com.kh.app.transaction.reservation.repository.ReservationRepository;

// Middle - Coupon
import com.kh.app.middle.coupon.entity.*;
import com.kh.app.middle.coupon.repository.CouponRepository;

// Board
import com.kh.app.board.faq.entity.FaqEntity;
import com.kh.app.board.faq.repository.FaqRepository;
import com.kh.app.board.notice.entity.NoticeEntity;
import com.kh.app.board.notice.repository.NoticeRepository;
import com.kh.app.board.review.entity.ReviewEntity;
import com.kh.app.board.review.repository.ReviewRepository;

// Java
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
```

> **주의**: Board 패키지의 정확한 구조(faq.entity, faq.repository 등)는
> 실제 소스 파일을 Read 툴로 확인 후 import 경로를 맞춰야 함.

### 2-2. [ ] 클래스 선언 및 Repository 주입

```java
@Component
@RequiredArgsConstructor
@Slf4j
@Order(10)  // CompanyInit(1), CouponInit(2) 등 기존 파일 삭제 후에는 Order 불필요
public class DataInitializer implements CommandLineRunner {

    private static final String IMG = "/dummy-images";

    // Member
    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;
    private final SellerRepository sellerRepository;
    private final BankRepository bankRepository;

    // Company
    private final CompanyRepository companyRepository;

    // Product
    private final SpaceRepository spaceRepository;
    private final SpacePictureRepository spacePictureRepository;
    private final SpaceArcadeRepository spaceArcadeRepository;
    private final ArcadeRepository arcadeRepository;
    private final StayRepository stayRepository;
    private final StayPictureRepository stayPictureRepository;
    private final StayOptionRepository stayOptionRepository;

    // Transaction
    private final ReservationRepository reservationRepository;

    // Middle
    private final CouponRepository couponRepository;

    // Board
    private final FaqRepository faqRepository;
    private final NoticeRepository noticeRepository;
    private final ReviewRepository reviewRepository;

    // Util
    private final S3PictureUploader s3PictureUploader;
    private final BCryptPasswordEncoder passwordEncoder;
```

### 2-3. [ ] run() 메서드 — 실행 순서

```java
@Override
@Transactional
public void run(String... args) {
    if (spaceRepository.count() > 0) {
        log.info("[DataInitializer] 기존 데이터 존재. 스킵.");
        return;
    }
    log.info("[DataInitializer] 더미 데이터 삽입 시작");

    // 1. 회사(Company) 생성
    seedCompanies();

    // 2. 은행(Bank) 생성
    List<BankEntity> banks = seedBanks();

    // 3. 회원 생성 (admin, user01~03, seller01~03)
    MemberEntity admin    = seedAdmin();
    List<MemberEntity> users   = seedUsers();
    List<MemberEntity> sellers = seedSellers(banks);

    // 4. 쿠폰 생성
    seedCoupons();

    // 5. Arcade(편의시설) 공통 목록 생성
    List<ArcadeEntity> arcades = seedArcades();

    // 6. Space + Stay 생성 (seller별 3개씩, stay별 3개씩)
    Map<String, Object> gangwonData  = seedGangwon(sellers.get(0), arcades);
    Map<String, Object> gyeonggiData = seedGyeonggi(sellers.get(1), arcades);
    Map<String, Object> gyeongnamData= seedGyeongnam(sellers.get(2), arcades);

    // 7. 예약 생성
    List<StayEntity>  allStays  = collectStays(gangwonData, gyeonggiData, gyeongnamData);
    List<SpaceEntity> allSpaces = collectSpaces(gangwonData, gyeonggiData, gyeongnamData);
    List<ReservationEntity> reservations = seedReservations(users, allStays, allSpaces);

    // 8. 리뷰 생성 (COMPLETED 예약 기준)
    seedReviews(reservations);

    // 9. FAQ / 공지사항 생성
    seedFaqs(admin);
    seedNotices(admin);

    log.info("[DataInitializer] 완료. spaces={}, stays={}, reservations={}",
        spaceRepository.count(), stayRepository.count(), reservationRepository.count());
}
```

### 2-4. [ ] seedCompanies() — 회사 데이터

```java
private void seedCompanies() {
    List<String[]> companies = List.of(
        new String[]{"kh 정보교육원", "111-22-33333"},
        new String[]{"네이버웹툰",    "222-33-44444"},
        new String[]{"카카오페이",    "333-44-55555"},
        new String[]{"토스뱅크",     "444-55-66666"}
    );
    companies.forEach(c -> {
        if (!companyRepository.existsByCompanyName(c[0])) {
            companyRepository.save(CompanyEntity.builder()
                .companyName(c[0]).businessNo(c[1]).build());
        }
    });
}
```

### 2-5. [ ] seedBanks() — 은행 데이터

```java
private List<BankEntity> seedBanks() {
    return bankRepository.saveAll(List.of(
        BankEntity.builder().bankName("국민은행").build(),
        BankEntity.builder().bankName("신한은행").build(),
        BankEntity.builder().bankName("우리은행").build(),
        BankEntity.builder().bankName("하나은행").build(),
        BankEntity.builder().bankName("농협은행").build()
    ));
}
```

### 2-6. [ ] seedAdmin() / seedUsers() / seedSellers()

```java
private MemberEntity seedAdmin() {
    MemberEntity admin = memberRepository.save(MemberEntity.builder()
        .username("admin")
        .password("$2a$10$xXAvSFMhjSjhVKnshkEt9uQCqIRP30sGWzHRpko42qQxggg7Mn1wm")  // 1234
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
        createSeller("seller01","seller01!","강원 운영자","010-5555-1001","seller01@workation.com",
            banks.get(0),"101-81-10001","11111111111111","강원 워케이션","(주)강원워케이션네트웍스"),
        createSeller("seller02","seller02!","경기 운영자","010-5555-1002","seller02@workation.com",
            banks.get(1),"101-81-10002","22222222222222","경기스테이랩","경기스테이랩(주)"),
        createSeller("seller03","seller03!","경남 운영자","010-5555-1003","seller03@workation.com",
            banks.get(2),"101-81-10003","33333333333333","경남 오션워크","경남오션워크플래닝")
    );
}
```

### 2-7. [ ] seedCoupons() — 쿠폰 (신규가입 + 생일)

```java
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
}
```

### 2-8. [ ] seedArcades() — 편의시설 목록

```java
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
```

### 2-9. [ ] seedGangwon() — 강원 3개 Space, 각 3개 Stay

```java
private Map<String, Object> seedGangwon(MemberEntity seller, List<ArcadeEntity> arcades) {
    List<SpaceEntity> spaces = new ArrayList<>();
    List<StayEntity> stays = new ArrayList<>();

    // ─── Hotel 1: 강원 포레스트 워케이션 호텔 ───
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
    stays.add(createStayFull(s1, "강원 포레스트 디럭스룸",
        "업무 데스크와 숲 전망을 갖춘 디럭스룸",
        "넓은 책상, 고속 Wi-Fi, 산 전망을 갖춰 장기 워케이션에 적합한 객실입니다.",
        2, 3, "Y", 145000, 185000, 215000,
        new StayOption[]{StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.REFRIGERATOR},
        List.of(si("gangwon/hotel1/강원1스테이(디럭스룸)1.png", true, 1),
                si("gangwon/hotel1/강원1스테이(디럭스룸)2.png", false, 2),
                si("gangwon/hotel1/강원1스테이(디럭스룸)3.png", false, 3),
                si("gangwon/hotel1/강원1스테이(디럭스룸)4.png", false, 4))));
    stays.add(createStayFull(s1, "강원 포레스트 스위트룸",
        "분리형 라운지와 프리미엄 업무 공간이 있는 스위트룸",
        "휴식 공간과 업무 공간이 분리되어 팀 단위 워케이션이나 장기 체류에 좋습니다.",
        2, 4, "Y", 220000, 270000, 320000,
        new StayOption[]{StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.COFFEE_MACHINE, StayOption.BATHTUB},
        List.of(si("gangwon/hotel1/강원1스테이(스위트룸)1.png", true,  1),
                si("gangwon/hotel1/강원1스테이(스위트룸)2.png", false, 2),
                si("gangwon/hotel1/강원1스테이(스위트룸)3.png", false, 3),
                si("gangwon/hotel1/강원1스테이(스위트룸)4.png", false, 4),
                si("gangwon/hotel1/강원1스테이(스위트룸)5.png", false, 5))));
    stays.add(createStayFull(s1, "강원 포레스트 패밀리룸",
        "가족이나 팀 단위에 적합한 넓은 패밀리룸",
        "2개의 독립 공간과 거실, 주방을 갖춰 4~5인 가족 워케이션에 최적화된 객실입니다.",
        4, 6, "N", 280000, 350000, 420000,
        new StayOption[]{StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.KITCHEN, StayOption.REFRIGERATOR, StayOption.COOKING_AVAILABLE},
        List.of(si("gangwon/hotel1/강원1스테이(패밀리룸)1.png", true,  1),
                si("gangwon/hotel1/강원1스테이(패밀리룸)2.png", false, 2),
                si("gangwon/hotel1/강원1스테이(패밀리룸)3.png", false, 3))));
    spaces.add(s1);

    // ─── Hotel 2: 강원 계곡 워케이션 빌라 ───
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
    stays.add(createStayFull(s2, "강원 계곡 디럭스룸",
        "계곡뷰와 업무 공간을 갖춘 디럭스룸",
        "통창 너머 계곡이 보이고, 고속 Wi-Fi와 업무 전용 책상이 구비된 객실입니다.",
        2, 3, "Y", 155000, 195000, 230000,
        new StayOption[]{StayOption.DESK, StayOption.RIVER_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.AMENITY},
        List.of(si("gangwon/hotel2/강원2스테이(디럭스룸)1.png", true, 1),
                si("gangwon/hotel2/강원2스테이(디럭스룸)2.png", false, 2),
                si("gangwon/hotel2/강원2스테이(디럭스룸)3.png", false, 3),
                si("gangwon/hotel2/강원2스테이(디럭스룸)4.png", false, 4))));
    stays.add(createStayFull(s2, "강원 계곡 스위트룸",
        "풀옵션 주방과 계곡 테라스를 갖춘 스위트룸",
        "별도 작업실과 독채 테라스, 취사 가능한 주방을 갖춘 프리미엄 스위트입니다.",
        2, 4, "Y", 235000, 285000, 340000,
        new StayOption[]{StayOption.DESK, StayOption.RIVER_VIEW, StayOption.KITCHEN, StayOption.BATHTUB, StayOption.COFFEE_MACHINE},
        List.of(si("gangwon/hotel2/강원2스테이(스위트룸)1.png", true,  1),
                si("gangwon/hotel2/강원2스테이(스위트룸)2.png", false, 2),
                si("gangwon/hotel2/강원2스테이(스위트룸)3.png", false, 3),
                si("gangwon/hotel2/강원2스테이(스위트룸)4.png", false, 4),
                si("gangwon/hotel2/강원2스테이(스위트룸)5.png", false, 5))));
    stays.add(createStayFull(s2, "강원 계곡 패밀리빌라",
        "독채 빌라 전체를 사용하는 패밀리룸",
        "빌라 전체를 독점 사용하는 형태로 가족 단위 워케이션에 최적입니다.",
        4, 8, "N", 380000, 450000, 530000,
        new StayOption[]{StayOption.DESK, StayOption.RIVER_VIEW, StayOption.KITCHEN, StayOption.COOKING_AVAILABLE, StayOption.TABLEWARE},
        List.of(si("gangwon/hotel2/강원2스테이(패밀리룸)1.png", true,  1),
                si("gangwon/hotel2/강원2스테이(패밀리룸)2.png", false, 2),
                si("gangwon/hotel2/강원2스테이(패밀리룸)3.png", false, 3))));
    spaces.add(s2);

    // ─── Hotel 3: 강원 스노우 워케이션 리조트 ───
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
    stays.add(createStayFull(s3, "강원 스노우 디럭스룸",
        "설산 전망의 워케이션 디럭스룸", "설산 뷰와 업무 전용 책상으로 집중력 높은 작업 환경을 제공합니다.",
        2, 3, "Y", 175000, 215000, 255000,
        new StayOption[]{StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.BIDET},
        List.of(si("gangwon/hotel3/강원3스테이(디럭스룸)1.png", true, 1),
                si("gangwon/hotel3/강원3스테이(디럭스룸)2.png", false, 2),
                si("gangwon/hotel3/강원3스테이(디럭스룸)3.png", false, 3),
                si("gangwon/hotel3/강원3스테이(디럭스룸)4.png", false, 4))));
    stays.add(createStayFull(s3, "강원 스노우 스위트룸",
        "자쿠지와 리조트 라운지가 딸린 스위트룸", "설산 전망 자쿠지 욕조와 전용 라운지를 갖춘 프리미엄 객실입니다.",
        2, 4, "Y", 260000, 320000, 385000,
        new StayOption[]{StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.BATHTUB, StayOption.COFFEE_MACHINE, StayOption.AMENITY},
        List.of(si("gangwon/hotel3/강원3스테이(스위트룸)1.png", true,  1),
                si("gangwon/hotel3/강원3스테이(스위트룸)2.png", false, 2),
                si("gangwon/hotel3/강원3스테이(스위트룸)3.png", false, 3),
                si("gangwon/hotel3/강원3스테이(스위트룸)4.png", false, 4),
                si("gangwon/hotel3/강원3스테이(스위트룸)5.png", false, 5))));
    stays.add(createStayFull(s3, "강원 스노우 패밀리룸",
        "스키 가족 여행에 최적화된 패밀리룸", "넓은 거실과 별도 침실 2개로 구성된 대가족 워케이션 룸입니다.",
        4, 6, "N", 340000, 430000, 510000,
        new StayOption[]{StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.KITCHEN, StayOption.REFRIGERATOR, StayOption.INDUCTION},
        List.of(si("gangwon/hotel3/강원3스테이(패밀리룸)1.png", true,  1),
                si("gangwon/hotel3/강원3스테이(패밀리룸)2.png", false, 2),
                si("gangwon/hotel3/강원3스테이(패밀리룸)3.png", false, 3))));
    spaces.add(s3);

    return Map.of("spaces", spaces, "stays", stays);
}
```

### 2-10. [ ] seedGyeonggi() — 경기 3개 Space, 각 3개 Stay

경기 호텔1 (기존 코드 + 패밀리룸 추가), hotel2, hotel3 추가.

```java
// 경기 비즈니스 워케이션 호텔 (기존 + 패밀리룸)
SpaceEntity g1 = createSpace(seller, "경기 비즈니스 워케이션 호텔", "0311232002",
    "gyeonggi01@workation.com", "수도권 접근성이 좋은 비즈니스형 워케이션 호텔",
    "회의와 숙박을 함께 운영하기 좋은 경기권 도심형 워케이션 공간입니다.",
    "경기도 성남시 분당구 판교역로", "202", Area.GYEONGGI, "37.3947000", "127.1112000");
// 사진: gyeonggi/호텔1/ (기존 경로 유지)
// 스테이: 경기 비즈니스 디럭스룸, 스위트룸, 패밀리룸
//   패밀리룸 이미지: gyeonggi/호텔1/경기호텔스테이(패밀리룸)1~3.png

// 경기 캠퍼스 워케이션 스위트 (신규 hotel2)
SpaceEntity g2 = createSpace(seller, "경기 캠퍼스 워케이션 스위트", "0311232003",
    "gyeonggi02@workation.com", "IT 캠퍼스 인접 모던 워케이션 스위트",
    "광교 테크노밸리 인근의 모던 빌딩형 워케이션 공간입니다.",
    "경기도 수원시 영통구 광교로", "456", Area.GYEONGGI, "37.2900000", "127.0500000");
// 사진: gyeonggi/hotel2/경기2외관.png ~ 경기2주차장.png
// 스테이: 경기 캠퍼스 디럭스룸, 스위트룸, 패밀리룸
//   이미지: gyeonggi/hotel2/경기2스테이(디럭스룸)1~4.png 등

// 경기 호수뷰 워케이션 리조트 (신규 hotel3)
SpaceEntity g3 = createSpace(seller, "경기 호수뷰 워케이션 리조트", "0311232004",
    "gyeonggi03@workation.com", "청평호 전망 힐링 워케이션 리조트",
    "청평호수 조망이 가능한 경기형 힐링 워케이션 리조트입니다.",
    "경기도 가평군 청평면 청평리", "789", Area.GYEONGGI, "37.7400000", "127.4800000");
// 사진: gyeonggi/hotel3/경기3외관.png ~ 경기3주차장.png
// 스테이: 경기 호수뷰 디럭스룸, 스위트룸, 패밀리룸
```

### 2-11. [ ] seedGyeongnam() — 경남 3개 Space, 각 3개 Stay

경남 호텔1 (기존 코드 + 패밀리룸 추가), hotel2, hotel3 추가.

```java
// 경남 오션 워케이션 호텔 (기존 + 패밀리룸)
// 사진: gyeongnam/호텔1/ (기존 경로 유지)
// 패밀리룸 이미지: gyeongnam/호텔1/경남호텔스테이(패밀리룸)1~3.png

// 경남 남해 워케이션 빌라 (신규 hotel2)
SpaceEntity n2 = createSpace(seller, "경남 남해 워케이션 빌라", "0551233004",
    "gyeongnam02@workation.com", "남해 한려수도 조망 워케이션 빌라",
    "한려수도 뷰와 함께하는 남해 독채 빌라형 워케이션 공간입니다.",
    "경상남도 남해군 창선면 창선해안로", "404", Area.GYEONGNAM, "34.7500000", "128.0200000");
// 사진: gyeongnam/hotel2/경남2외관.png ~ 경남2주차장.png
// 스테이: 경남 남해 디럭스룸, 스위트룸, 패밀리룸

// 경남 통영 마린 워케이션 (신규 hotel3)
SpaceEntity n3 = createSpace(seller, "경남 통영 마린 워케이션", "0551233005",
    "gyeongnam03@workation.com", "통영항 조망 마린 워케이션 호텔",
    "통영 항구의 다이나믹한 뷰와 함께하는 해양 테마 워케이션 공간입니다.",
    "경상남도 통영시 해저터널로", "505", Area.GYEONGNAM, "34.8460000", "128.4220000");
// 사진: gyeongnam/hotel3/경남3외관.png ~ 경남3주차장.png
// 스테이: 경남 통영 디럭스룸, 스위트룸, 패밀리룸
```

### 2-12. [ ] seedReservations() — 예약 더미 데이터

stay당 7개 상태 × 2건 = 14건 / 27 stays → 총 378건

```java
private List<ReservationEntity> seedReservations(
        List<MemberEntity> users,
        List<StayEntity> stays,
        List<SpaceEntity> spaces) {

    List<ReservationEntity> result = new ArrayList<>();
    LocalDate today = LocalDate.now();
    int userIdx = 0;

    record StatusConfig(ReservationStatus status, LocalDate checkin, int nights) {}

    for (int i = 0; i < stays.size(); i++) {
        StayEntity stay = stays.get(i);
        SpaceEntity space = spaces.get(i / 3);  // 3 stays per space
        int basePrice = stay.getMonPrice();

        List<StatusConfig> configs = List.of(
            new StatusConfig(ReservationStatus.COMPLETED,         today.minusMonths(5).withDayOfMonth(10), 2),
            new StatusConfig(ReservationStatus.COMPLETED,         today.minusMonths(3).withDayOfMonth(15), 3),
            new StatusConfig(ReservationStatus.RESERVED,          today.plusMonths(1).withDayOfMonth(20),  2),
            new StatusConfig(ReservationStatus.RESERVED,          today.plusMonths(2).withDayOfMonth(5),   3),
            new StatusConfig(ReservationStatus.PAYMENT_COMPLETED, today.plusMonths(2).withDayOfMonth(15),  2),
            new StatusConfig(ReservationStatus.PAYMENT_COMPLETED, today.plusMonths(3).withDayOfMonth(8),   2),
            new StatusConfig(ReservationStatus.PENDING,           today.plusDays(10),  1),
            new StatusConfig(ReservationStatus.PENDING,           today.plusDays(20),  2),
            new StatusConfig(ReservationStatus.USER_CANCELLED,    today.minusMonths(2).withDayOfMonth(12), 2),
            new StatusConfig(ReservationStatus.USER_CANCELLED,    today.minusMonths(1).withDayOfMonth(18), 2),
            new StatusConfig(ReservationStatus.SELLER_CANCELLED,  today.minusMonths(3).withDayOfMonth(9),  2),
            new StatusConfig(ReservationStatus.SELLER_CANCELLED,  today.minusMonths(2).withDayOfMonth(25), 2),
            new StatusConfig(ReservationStatus.REFUND_COMPLETED,  today.minusMonths(4).withDayOfMonth(7),  2),
            new StatusConfig(ReservationStatus.REFUND_COMPLETED,  today.minusMonths(6).withDayOfMonth(20), 3)
        );

        String[] names  = {"홍길동", "김예약", "이결제", "박대기", "최취소", "정거절", "윤환불"};
        String[] phones = {"01012341234", "01056785678", "01011112222",
                           "01033334444", "01099998888", "01077776666", "01044445555"};

        for (StatusConfig cfg : configs) {
            MemberEntity user = users.get(userIdx++ % users.size());
            long price = (long) basePrice * cfg.nights();
            result.add(reservationRepository.save(ReservationEntity.builder()
                .member(user).stay(stay).space(space)
                .checkinDate(cfg.checkin()).checkoutDate(cfg.checkin().plusDays(cfg.nights()))
                .guestCount(2)
                .primaryGuestName(names[userIdx % names.length])
                .primaryGuestPhone(phones[userIdx % phones.length])
                .primaryGuestEmail("test" + userIdx + "@workation.com")
                .originalPrice(price).discountAmount(0L).totalPrice(price)
                .status(cfg.status())
                .orderId("ORD-" + stay.getId() + "-" + cfg.status().name() + "-" + userIdx)
                .build()));
        }
    }
    return result;
}
```

### 2-13. [ ] seedReviews() — 리뷰 더미 데이터

COMPLETED 예약 건당 리뷰 1개.

```java
private void seedReviews(List<ReservationEntity> reservations) {
    List<ReservationEntity> completed = reservations.stream()
        .filter(r -> r.getStatus() == ReservationStatus.COMPLETED)
        .toList();

    String[] titles = {
        "최고의 워케이션 경험!", "업무와 휴식을 동시에", "재방문 의사 있어요",
        "시설이 너무 좋아요", "직원 서비스 최고", "위치가 완벽합니다",
        "넓고 쾌적한 공간", "Wi-Fi 빠르고 책상 편해요"
    };
    String[] tags = {
        "#워케이션추천", "#재방문확정", "#힐링", "#업무효율UP",
        "#가족여행", "#혼자여행", "#팀워크", "#집중력강화"
    };
    String body = "업무 환경이 잘 갖춰져 있고 주변 경관도 아름다워 집중이 잘 됐습니다. " +
        "체크인부터 체크아웃까지 불편함 없이 이용했으며 특히 조식이 훌륭했습니다. " +
        "다음에 또 방문하고 싶은 워케이션 공간이었습니다.";

    for (int i = 0; i < completed.size(); i++) {
        reviewRepository.save(ReviewEntity.builder()
            .member(completed.get(i).getMember())
            .title(titles[i % titles.length])
            .content(body)
            .tag(tags[i % tags.length])
            .rating(4 + (i % 2))
            .build());
    }
}
```

### 2-14. [ ] seedFaqs() — FAQ 20개

```java
private void seedFaqs(MemberEntity admin) {
    if (faqRepository.count() > 0) return;
    List<String[]> faqs = List.of(
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
    faqs.forEach(qa -> faqRepository.save(
        FaqEntity.builder().member(admin).question(qa[0]).answer(qa[1]).build()
    ));
}
```

### 2-15. [ ] seedNotices() — 공지사항 20개

```java
private void seedNotices(MemberEntity admin) {
    if (noticeRepository.count() > 0) return;
    List<String[]> notices = List.of(
        // pinYn, title, content
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
    notices.forEach(n -> noticeRepository.save(
        NoticeEntity.builder().member(admin).pinYn(n[0]).title(n[1]).content(n[2]).build()
    ));
}
```

### 2-16. [ ] 헬퍼 메서드 전체

```java
// ── 공통 헬퍼 ──────────────────────────────────────────────────────────────

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
        log.warn("[DataInitializer] S3 업로드 실패, static fallback: {}", resourcePath);
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
        .username(username).password(passwordEncoder.encode(pw)).roleSet(Set.of(role)).build());
    profileRepository.save(MemberProfileEntity.builder()
        .member(m).name(name).phone(phone).email(email).build());
    return m;
}

private MemberEntity createSeller(String username, String pw, String name,
        String phone, String email, BankEntity bank,
        String bizNo, String account, String accountName, String companyName) {
    MemberEntity m = createMember(username, pw, Role.SELLER, name, phone, email);
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
            .space(space).filePath(resolveImageUrl(img.path()))
            .originName(fname(img.path())).storedName(fname(img.path()))
            .mainYn(img.mainYn()).sortOrder(img.order())
            .category(img.category()).contentType("image/png").fileSize(0L).build())
        .toList());
}

private void addStayPics(StayEntity stay, List<StayImgInfo> imgs) {
    stayPictureRepository.saveAll(imgs.stream()
        .map(img -> StayPictureEntity.builder()
            .stay(stay).filePath(resolveImageUrl(img.path()))
            .originName(fname(img.path())).storedName(fname(img.path()))
            .mainYn(img.mainYn()).sortOrder(img.order())
            .contentType("image/png").fileSize(0L).build())
        .toList());
}

private void linkArcades(SpaceEntity space, List<ArcadeEntity> arcades, int... indices) {
    for (int idx : indices) {
        spaceArcadeRepository.save(
            SpaceArcadeEntity.builder().space(space).arcade(arcades.get(idx)).build());
    }
}

private List<StayEntity> collectStays(Map<String, Object>... dataMaps) {
    List<StayEntity> all = new ArrayList<>();
    for (Map<String, Object> m : dataMaps) all.addAll((List<StayEntity>) m.get("stays"));
    return all;
}

private List<SpaceEntity> collectSpaces(Map<String, Object>... dataMaps) {
    List<SpaceEntity> all = new ArrayList<>();
    for (Map<String, Object> m : dataMaps) all.addAll((List<SpaceEntity>) m.get("spaces"));
    return all;
}
```

---

## Phase 3: 추가 권장 더미 데이터

> 아래 데이터는 Admin/Seller 대시보드 통계 테스트에 매우 유용하다.
> 구현 여부를 유저에게 먼저 확인 후 진행한다.

### 3-1. [ ] PaymentEntity — 결제 데이터

대상: PAYMENT_COMPLETED, RESERVED, COMPLETED, REFUND_COMPLETED 상태 예약.
통합 DataInitializer의 `seedReservations()` 이후 별도 메서드로 추가.

```java
// 각 대상 예약에 PaymentEntity 생성
// status: SUCCESS(완료/예약확정) 또는 REFUNDED(환불완료)
// paymentMethod: CARD
// approvedAt: checkinDate - 7일
```

### 3-2. [ ] RefundEntity — 환불 데이터

대상: REFUND_COMPLETED 상태 예약.

```java
// RefundEntity: reservation, transactionKey(UUID), refundAmount, 
//               refundReason(SIMPLE_CHANGE), refundedAt(과거 날짜)
```

### 3-3. [ ] SalesEntity — 매출 데이터

Payment.status = SUCCESS인 건들에 대해 SalesEntity 생성.
Admin 매출 대시보드 통계 차트 테스트에 필수.

### 3-4. [ ] MemberCouponEntity — 쿠폰 발급

user01~03에게 WELCOME-10 쿠폰 각 1개 발급 (미사용 상태).

### 3-5. [ ] WishlistEntity — 찜 목록

user01~03이 각각 3개 공간을 찜.

### 3-6. [ ] SpaceApplyEntity — 공간 승인 이력

9개 공간 모두 APPROVED 상태로 SpaceApply 레코드 생성.

---

## product 외부 파일 변경 안내

> 아래 파일들은 **직접 수정/삭제 불가** (작업 범위 밖).
> 아래 내용을 참고하여 유저가 직접 처리하거나, 별도 허가 후 작업.

### 삭제해야 할 파일

| 파일 | 이유 | 삭제 방법 |
|------|------|-----------|
| `workation/back/src/main/java/com/kh/app/product/DataInitializer.java` | 통합 DataInitializer로 대체됨 | IDE에서 파일 삭제 또는 `git rm` |
| `workation/back/src/main/java/com/kh/app/middle/CouponInit.java` | 통합 DataInitializer로 흡수됨 | IDE에서 파일 삭제 또는 `git rm` |
| `workation/back/src/main/java/com/kh/app/company/CompanyInit.java` | 통합 DataInitializer로 흡수됨 | IDE에서 파일 삭제 또는 `git rm` |

> 삭제하지 않으면 서버 재시작 시 두 DataInitializer가 모두 실행되어 데이터 중복/충돌 발생.

### 수정해야 할 파일 (직접 수정 불가 — 위치만 안내)

| 파일 | 수정 내용 |
|------|-----------|
| (없음 — 통합 DataInitializer는 독립 실행 가능) | — |

### Board 패키지 구조 확인 필요

FAQ, Notice, Review repository의 정확한 패키지 경로는 실제 파일을 확인해야 한다.

```bash
# 실제 경로 확인
find workation/back/src -name "FaqRepository.java"
find workation/back/src -name "NoticeRepository.java"
find workation/back/src -name "ReviewRepository.java"
```

확인 후 DataInitializer의 import 경로를 맞춰서 작성할 것.

---

## 최종 확인 체크리스트

```
[ ] generate_dummy_images.py 실행 완료 (79장 이미지 생성)
[ ] com/kh/app/DataInitializer.java 신규 작성 완료
[ ] 기존 product/DataInitializer.java 삭제 완료 (유저 직접)
[ ] 기존 CouponInit.java, CompanyInit.java 삭제 완료 (유저 직접)
[ ] 서버 재시작 후 Swagger 접속 확인
[ ] admin (admin/1234) 로그인 → 공간 9개, FAQ 20개, 공지 20개 확인
[ ] seller01 (seller01/seller01!) → 대시보드 공간 3개 표시 확인
[ ] user01 (user01/user01!) → 마이페이지 예약 내역 확인
[ ] 쿠폰 목록 → WELCOME-10, BIRTHDAY-20 2개 확인
```

---

## 주의사항

1. **DDL 전략 `create`** — 서버 재시작 시 테이블 재생성. DataInitializer 가드(`count() > 0`)는 항상 통과하므로 매 재시작마다 전체 더미 데이터가 삽입된다.

2. **orderId unique 제약** — 예약 생성 시 `stay.getId() + status + 카운터` 조합으로 유일성 보장. 충돌 시 UUID 방식으로 교체.

3. **Init 실행 순서** — 단일 DataInitializer로 통합되므로 run() 메서드 내 순서만 지키면 됨 (회원 → 쿠폰 → 공간 → 예약 → 리뷰 → FAQ → 공지).

4. **Board 패키지 확인** — FaqRepository, NoticeRepository, ReviewRepository의 정확한 패키지 경로를 코드 작성 전에 반드시 `Read` 툴로 확인.

5. **이미지 경로 일관성** — 경기/경남 기존 폴더명(`호텔1`)은 한글, 신규 폴더명(`hotel2`)은 영문. DataInitializer 내 경로 문자열과 실제 파일 경로를 정확히 일치시킬 것.
