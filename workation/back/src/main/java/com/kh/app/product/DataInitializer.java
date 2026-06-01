package com.kh.app.product;

import com.kh.app.member.entity.BankEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.MemberProfileEntity;
import com.kh.app.member.entity.Role;
import com.kh.app.member.entity.SellerEntity;
import com.kh.app.member.repository.BankRepository;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.member.repository.ProfileRepository;
import com.kh.app.member.repository.SellerRepository;
import com.kh.app.product.common.util.S3PictureUploader;
import com.kh.app.product.space.entity.Area;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.space.entity.SpacePictureCategory;
import com.kh.app.product.space.entity.SpacePictureEntity;
import com.kh.app.product.space.repository.SpacePictureRepository;
import com.kh.app.product.space.repository.SpaceRepository;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.entity.StayOption;
import com.kh.app.product.stay.entity.StayOptionEntity;
import com.kh.app.product.stay.entity.StayPictureEntity;
import com.kh.app.product.stay.repository.StayOptionRepository;
import com.kh.app.product.stay.repository.StayPictureRepository;
import com.kh.app.product.stay.repository.StayRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

/**
 * 더미 이미지는 src/main/resources/static/dummy-images/ 에 위치.
 * Spring Boot 정적 리소스로 /dummy-images/** 경로로 자동 서빙됨.
 * git에 커밋하여 모든 PC에서 동일하게 동작.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private static final String IMG = "/dummy-images";

    private final SpaceRepository spaceRepository;
    private final SpacePictureRepository spacePictureRepository;
    private final StayRepository stayRepository;
    private final StayPictureRepository stayPictureRepository;
    private final StayOptionRepository stayOptionRepository;
    private final BankRepository bankRepository;
    private final MemberRepository memberRepository;
    private final SellerRepository sellerRepository;
    private final ProfileRepository profileRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final S3PictureUploader s3PictureUploader;

    @Override
    @Transactional
    public void run(String... args) {
        if (spaceRepository.count() > 0) {
            log.info("[DataInitializer] 기존 데이터 존재. 더미 삽입 스킵. spaceCount={}", spaceRepository.count());
            return;
        }
        log.info("[DataInitializer] 더미 데이터 삽입 시작");

        MemberEntity admin = memberRepository.save(MemberEntity.builder()
                .username("admin")
                .password("$2a$10$xXAvSFMhjSjhVKnshkEt9uQCqIRP30sGWzHRpko42qQxggg7Mn1wm")
                .roleSet(Set.of(Role.ADMIN))
                .build());
        profileRepository.save(MemberProfileEntity.builder()
                .member(admin).name("관리자").phone("010-0000-0000").email("admin@workation.com").build());

        List<BankEntity> banks = bankRepository.saveAll(List.of(
                BankEntity.builder().bankName("국민은행").build(),
                BankEntity.builder().bankName("신한은행").build(),
                BankEntity.builder().bankName("우리은행").build(),
                BankEntity.builder().bankName("하나은행").build(),
                BankEntity.builder().bankName("농협은행").build()
        ));

        createMember("user01", "user01!", Role.USER, "김유저", "010-1111-2222", "user01@workation.com");
        createMember("user02", "user02!", Role.USER, "이유저", "010-3333-4444", "user02@workation.com");

        MemberEntity seller01 = createSeller("seller01", "seller01!", "강원 운영자", "010-5555-1001",
                "seller01@workation.com", banks.get(0), "101-81-10001", "11111111111111", "강원 워케이션","(주)강원워케이션네트웍스");
        MemberEntity seller02 = createSeller("seller02", "seller02!", "경기 운영자", "010-5555-1002",
                "seller02@workation.com", banks.get(1), "101-81-10002", "22222222222222", "경기 스테이랩", "경기스테이랩(주)");
        MemberEntity seller03 = createSeller("seller03", "seller03!", "경남 운영자", "010-5555-1003",
                "seller03@workation.com", banks.get(2), "101-81-10003", "33333333333333", "경남 오션워크","경남오션워크플래닝");

        seedGangwon(seller01);
        seedGyeonggi(seller02);
        seedGyeongnam(seller03);

        log.info("[DataInitializer] 완료. spaces={}, stays={}", spaceRepository.count(), stayRepository.count());
    }

    private void seedGangwon(MemberEntity seller) {
        SpaceEntity space = createSpace(seller, "강원 포레스트 워케이션 호텔", "0331231001",
                "gangwon01@workation.com", "숲과 산 전망이 있는 강원 워케이션 호텔",
                "조용한 산림 속에서 숙박과 업무를 함께 해결할 수 있는 강원형 워케이션 공간입니다.",
                "강원특별자치도 속초시 설악산로", "101", Area.GANGWON, "38.2070000", "128.5910000");

        addSpacePics(space, List.of(
                sp("gangwon/hotel1/강원1외관.png",   SpacePictureCategory.EXTERIOR, true,  1),
                sp("gangwon/hotel1/강원1로비.png",   SpacePictureCategory.FACILITY, false, 2),
                sp("gangwon/hotel1/강원1오피스.png", SpacePictureCategory.OFFICE,   false, 3),
                sp("gangwon/hotel1/강원1카페.png",   SpacePictureCategory.DINING,   false, 4),
                sp("gangwon/hotel1/강원1주차장.png", SpacePictureCategory.AMENITY,  false, 5)
        ));

        StayEntity deluxe = createStay(space, "강원 포레스트 디럭스룸",
                "업무 데스크와 숲 전망을 갖춘 디럭스룸",
                "넓은 책상, 고속 Wi-Fi, 산 전망을 갖춰 장기 워케이션에 적합한 객실입니다.",
                2, 3, "Y", 145000, 185000, 215000);
        addStayOptions(deluxe, StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.REFRIGERATOR);
        addStayPics(deluxe, List.of(
                si("gangwon/hotel1/강원1스테이(디럭스룸)1.png", true,  1),
                si("gangwon/hotel1/강원1스테이(디럭스룸)2.png", false, 2),
                si("gangwon/hotel1/강원1스테이(디럭스룸)3.png", false, 3),
                si("gangwon/hotel1/강원1스테이(디럭스룸)4.png", false, 4)
        ));

        StayEntity suite = createStay(space, "강원 포레스트 스위트룸",
                "분리형 라운지와 프리미엄 업무 공간이 있는 스위트룸",
                "휴식 공간과 업무 공간이 분리되어 팀 단위 워케이션이나 장기 체류에 좋습니다.",
                2, 4, "Y", 220000, 270000, 320000);
        addStayOptions(suite, StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.COFFEE_MACHINE, StayOption.BATHTUB);
        addStayPics(suite, List.of(
                si("gangwon/hotel1/강원1스테이(스위트룸)1.png", true,  1),
                si("gangwon/hotel1/강원1스테이(스위트룸)2.png", false, 2),
                si("gangwon/hotel1/강원1스테이(스위트룸)3.png", false, 3),
                si("gangwon/hotel1/강원1스테이(스위트룸)4.png", false, 4),
                si("gangwon/hotel1/강원1스테이(스위트룸)5.png", false, 5)
        ));
    }

    private void seedGyeonggi(MemberEntity seller) {
        SpaceEntity space = createSpace(seller, "경기 비즈니스 워케이션 호텔", "0311232002",
                "gyeonggi01@workation.com", "수도권 접근성이 좋은 비즈니스형 워케이션 호텔",
                "회의와 숙박을 함께 운영하기 좋은 경기권 도심형 워케이션 공간입니다.",
                "경기도 성남시 분당구 판교역로", "202", Area.GYEONGGI, "37.3947000", "127.1112000");

        addSpacePics(space, List.of(
                sp("gyeonggi/호텔1/경기호텔외관1.png",  SpacePictureCategory.EXTERIOR, true,  1),
                sp("gyeonggi/호텔1/경기호텔로비1.png",  SpacePictureCategory.FACILITY, false, 2),
                sp("gyeonggi/호텔1/경기호텔로비2.png",  SpacePictureCategory.FACILITY, false, 3),
                sp("gyeonggi/호텔1/경기호텔오피스1.png",SpacePictureCategory.OFFICE,   false, 4),
                sp("gyeonggi/호텔1/경기호텔오피스2.png",SpacePictureCategory.OFFICE,   false, 5),
                sp("gyeonggi/호텔1/경기호텔주차장1.png",SpacePictureCategory.AMENITY,  false, 6)
        ));

        StayEntity deluxe = createStay(space, "경기 비즈니스 디럭스룸",
                "도심 접근성과 업무 편의성을 함께 갖춘 디럭스룸",
                "판교 업무지구와 가까우며 객실 내 책상과 빠른 네트워크 환경을 제공합니다.",
                2, 2, "Y", 135000, 175000, 205000);
        addStayOptions(deluxe, StayOption.DESK, StayOption.CITY_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.COFFEE_MACHINE);
        addStayPics(deluxe, List.of(
                si("gyeonggi/호텔1/경기호텔스테이(디럭스룸)1.png", true,  1),
                si("gyeonggi/호텔1/경기호텔스테이(디럭스룸)2.png", false, 2),
                si("gyeonggi/호텔1/경기호텔스테이(디럭스룸)3.png", false, 3),
                si("gyeonggi/호텔1/경기호텔스테이(디럭스룸)4.png", false, 4)
        ));

        StayEntity suite = createStay(space, "경기 비즈니스 스위트룸",
                "회의 전후 체류에 적합한 넓은 스위트룸",
                "라운지형 객실과 업무용 데스크를 갖춘 객실로 소규모 출장 일정에 적합합니다.",
                2, 4, "Y", 205000, 255000, 300000);
        addStayOptions(suite, StayOption.DESK, StayOption.CITY_VIEW, StayOption.BATHTUB, StayOption.REFRIGERATOR);
        addStayPics(suite, List.of(
                si("gyeonggi/호텔1/경기호텔스테이(스위트룸)1.png", true,  1),
                si("gyeonggi/호텔1/경기호텔스테이(스위트룸)2.png", false, 2),
                si("gyeonggi/호텔1/경기호텔스테이(스위트룸)3.png", false, 3),
                si("gyeonggi/호텔1/경기호텔스테이(스위트룸)4.png", false, 4),
                si("gyeonggi/호텔1/경기호텔스테이(스위트룸)5.png", false, 5)
        ));
    }

    private void seedGyeongnam(MemberEntity seller) {
        SpaceEntity space = createSpace(seller, "경남 오션 워케이션 호텔", "0551233003",
                "gyeongnam01@workation.com", "바다 가까운 경남 오션 워케이션 호텔",
                "남해안 여행과 업무를 함께 즐길 수 있는 경남형 워케이션 숙소입니다.",
                "경상남도 거제시 장승포해안로", "303", Area.GYEONGNAM, "34.8806000", "128.6211000");

        addSpacePics(space, List.of(
                sp("gyeongnam/호텔1/경남호텔외관1.png",  SpacePictureCategory.EXTERIOR, true,  1),
                sp("gyeongnam/호텔1/경남호텔외관2.png",  SpacePictureCategory.EXTERIOR, false, 2),
                sp("gyeongnam/호텔1/경남호텔로비1.png",  SpacePictureCategory.FACILITY, false, 3),
                sp("gyeongnam/호텔1/경남호텔로비2.png",  SpacePictureCategory.FACILITY, false, 4),
                sp("gyeongnam/호텔1/경남호텔오피스1.png",SpacePictureCategory.OFFICE,   false, 5),
                sp("gyeongnam/호텔1/경남호텔주차장1.png",SpacePictureCategory.AMENITY,  false, 6)
        ));

        StayEntity deluxe = createStay(space, "경남 오션 디럭스룸",
                "해안과 가까운 실속형 워케이션 디럭스룸",
                "바다 근처에서 집중 업무와 휴식을 함께 누릴 수 있는 기본형 객실입니다.",
                2, 3, "Y", 125000, 165000, 195000);
        addStayOptions(deluxe, StayOption.DESK, StayOption.OCEAN_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.AMENITY);
        addStayPics(deluxe, List.of(
                si("gyeongnam/호텔1/경남호텔스테이(디럭스룸)1.png", true,  1),
                si("gyeongnam/호텔1/경남호텔스테이(디럭스룸)2.png", false, 2),
                si("gyeongnam/호텔1/경남호텔스테이(디럭스룸)3.png", false, 3),
                si("gyeongnam/호텔1/경남호텔스테이(디럭스룸)4.png", false, 4)
        ));

        StayEntity juniorSuite = createStay(space, "경남 오션 주니어스위트룸",
                "여유 있는 침실과 업무 공간을 갖춘 주니어스위트룸",
                "넓은 객실과 업무용 좌석을 갖춰 가족 동반 워케이션에도 사용할 수 있습니다.",
                2, 4, "Y", 185000, 230000, 270000);
        addStayOptions(juniorSuite, StayOption.DESK, StayOption.OCEAN_VIEW, StayOption.BATHTUB, StayOption.COFFEE_MACHINE);
        addStayPics(juniorSuite, List.of(
                si("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)1.png", true,  1),
                si("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)2.png", false, 2),
                si("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)3.png", false, 3),
                si("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)4.png", false, 4),
                si("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)5.png", false, 5)
        ));
    }

    /**
     * 클래스패스 이미지를 S3에 업로드 시도, 실패 시 static 경로 fallback.
     */
    private String resolveImageUrl(String resourcePath) {
        try {
            ClassPathResource resource = new ClassPathResource("static/dummy-images/" + resourcePath);
            if (resource.exists()) {
                String filename = resourcePath.contains("/")
                        ? resourcePath.substring(resourcePath.lastIndexOf('/') + 1)
                        : resourcePath;
                String s3Url = s3PictureUploader.uploadFromStream(resource.getInputStream(), filename, "dummy");
                if (s3Url != null) {
                    log.debug("[DataInitializer] S3 업로드 성공: {}", s3Url);
                    return s3Url;
                }
            }
        } catch (Exception e) {
            log.warn("[DataInitializer] S3 업로드 실패, static fallback 사용: {}", resourcePath);
        }
        return IMG + "/" + resourcePath;
    }

    // ── 헬퍼 ──
    private record SpaceImgInfo(String path, SpacePictureCategory category, String mainYn, int order) {}
    private record StayImgInfo(String path, String mainYn, int order) {}

    private SpaceImgInfo sp(String path, SpacePictureCategory cat, boolean main, int order) {
        return new SpaceImgInfo(path, cat, main ? "Y" : "N", order);
    }
    private StayImgInfo si(String path, boolean main, int order) {
        return new StayImgInfo(path, main ? "Y" : "N", order);
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

    private void addStayOptions(StayEntity stay, StayOption... options) {
        stayOptionRepository.saveAll(Arrays.stream(options)
                .map(o -> StayOptionEntity.builder().stay(stay).stayOption(o).build())
                .toList());
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
                                      String bizNo, String account, String accountName , String companyName) {
        MemberEntity m = createMember(username, pw, Role.SELLER, name, phone, email);
        sellerRepository.save(SellerEntity.builder()
                .member(m)
                .bank(bank)
                .businessNo(bizNo)
                .account(account)
                .accountName(accountName)
                .companyName(companyName)
                .build());
        return m;
    }

    private SpaceEntity createSpace(MemberEntity seller, String name, String phone, String email,
                                    String summary, String desc, String addr1, String addr2,
                                    Area area, String lat, String lng) {
        return spaceRepository.save(SpaceEntity.builder()
                .seller(seller).name(name).phone(phone).email(email)
                .summary(summary).description(desc).address1(addr1).address2(addr2).area(area)
                .latitude(new BigDecimal(lat)).longitude(new BigDecimal(lng))
                .visibleYn("Y").approvalStatus(com.kh.app.product.space.entity.SpaceApprovalStatus.APPROVED).build());
    }

    private StayEntity createStay(SpaceEntity space, String name, String summary, String desc,
                                  int capacity, int maxCapa, String workationYn,
                                  int weekday, int friSun, int satHoliday) {
        return stayRepository.save(StayEntity.builder()
                .space(space).name(name).summary(summary).description(desc)
                .capacity(capacity).maxCapa(maxCapa)
                .checkInTime(LocalTime.of(15, 0)).checkOutTime(LocalTime.of(11, 0))
                .monPrice(weekday).tuePrice(weekday).wedPrice(weekday).thuPrice(weekday)
                .friPrice(friSun).satPrice(satHoliday).sunPrice(friSun).holidayPrice(satHoliday)
                .workationYn(workationYn).build());
    }
}
