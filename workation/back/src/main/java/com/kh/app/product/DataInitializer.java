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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private static final String IMAGE_URL_PREFIX = "/api/public/product/dummy-images";

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

    @Override
    @Transactional
    public void run(String... args) {
        if (spaceRepository.count() > 0) {
            log.info("[DataInitializer] Existing space data found. Skip dummy insert. spaceCount={}", spaceRepository.count());
            return;
        }

        log.info("[DataInitializer] Dummy data insert start.");

        MemberEntity admin = memberRepository.save(MemberEntity.builder()
                .username("admin")
                .password("$2a$10$xXAvSFMhjSjhVKnshkEt9uQCqIRP30sGWzHRpko42qQxggg7Mn1wm")
                .roleSet(Set.of(Role.ADMIN))
                .build());

        profileRepository.save(MemberProfileEntity.builder()
                .member(admin)
                .name("관리자")
                .phone("010-0000-0000")
                .email("admin@workation.com")
                .build());

        List<BankEntity> banks = bankRepository.saveAll(List.of(
                BankEntity.builder().bankName("국민은행").build(),
                BankEntity.builder().bankName("신한은행").build(),
                BankEntity.builder().bankName("우리은행").build(),
                BankEntity.builder().bankName("하나은행").build(),
                BankEntity.builder().bankName("농협은행").build()
        ));

        createMember("user01", "user01!", Role.USER, "김유저", "010-1111-2222", "user01@workation.com");
        createMember("user02", "user02!", Role.USER, "이유저", "010-3333-4444", "user02@workation.com");

        MemberEntity seller01 = createSeller(
                "seller01", "seller01!", "강원 운영자", "010-5555-1001", "seller01@workation.com",
                banks.get(0), "101-81-10001", "11111111111111", "강원 워케이션"
        );
        MemberEntity seller02 = createSeller(
                "seller02", "seller02!", "경기 운영자", "010-5555-1002", "seller02@workation.com",
                banks.get(1), "101-81-10002", "22222222222222", "경기 스테이랩"
        );
        MemberEntity seller03 = createSeller(
                "seller03", "seller03!", "경남 운영자", "010-5555-1003", "seller03@workation.com",
                banks.get(2), "101-81-10003", "33333333333333", "경남 오션워크"
        );

        seedGangwonSeller(seller01);
        seedGyeonggiSeller(seller02);
        seedGyeongnamSeller(seller03);

        log.info("[DataInitializer] Dummy data insert completed. members={}, banks={}, spaces={}, stays={}",
                memberRepository.count(), bankRepository.count(), spaceRepository.count(), stayRepository.count());
    }

    private void seedGangwonSeller(MemberEntity seller) {
        SpaceEntity space = createSpace(
                seller,
                "강원 포레스트 워케이션 호텔",
                "0331231001",
                "gangwon01@workation.com",
                "숲과 산 전망이 있는 강원 워케이션 호텔",
                "조용한 산림 속에서 숙박과 업무를 함께 해결할 수 있는 강원형 워케이션 공간입니다.",
                "강원특별자치도 속초시 설악산로",
                "101",
                Area.GANGWON,
                "38.2070000",
                "128.5910000"
        );

        addSpacePictures(space, List.of(
                spaceImage("gangwon/hotel1/강원1외관.png", SpacePictureCategory.EXTERIOR, true, 1),
                spaceImage("gangwon/hotel1/강원1로비.png", SpacePictureCategory.FACILITY, false, 2),
                spaceImage("gangwon/hotel1/강원1오피스.png", SpacePictureCategory.OFFICE, false, 3),
                spaceImage("gangwon/hotel1/강원1카페.png", SpacePictureCategory.DINING, false, 4),
                spaceImage("gangwon/hotel1/강원1주차장.png", SpacePictureCategory.AMENITY, false, 5)
        ));

        StayEntity deluxe = createStay(
                space,
                "강원 포레스트 디럭스룸",
                "업무 데스크와 숲 전망을 갖춘 디럭스룸",
                "넓은 책상, 고속 Wi-Fi, 산 전망을 갖춰 장기 워케이션에 적합한 객실입니다.",
                2,
                3,
                "Y",
                145000,
                185000,
                215000
        );
        addStayOptions(deluxe, StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.REFRIGERATOR);
        addStayPictures(deluxe, List.of(
                stayImage("gangwon/hotel1/강원1스테이(디럭스룸)1.png", true, 1),
                stayImage("gangwon/hotel1/강원1스테이(디럭스룸)2.png", false, 2),
                stayImage("gangwon/hotel1/강원1스테이(디럭스룸)3.png", false, 3),
                stayImage("gangwon/hotel1/강원1스테이(디럭스룸)4.png", false, 4)
        ));

        StayEntity suite = createStay(
                space,
                "강원 포레스트 스위트룸",
                "분리형 라운지와 프리미엄 업무 공간이 있는 스위트룸",
                "휴식 공간과 업무 공간이 분리되어 팀 단위 워케이션이나 장기 체류에 좋습니다.",
                2,
                4,
                "Y",
                220000,
                270000,
                320000
        );
        addStayOptions(suite, StayOption.DESK, StayOption.MOUNTAIN_VIEW, StayOption.COFFEE_MACHINE, StayOption.BATHTUB);
        addStayPictures(suite, List.of(
                stayImage("gangwon/hotel1/강원1스테이(스위트룸)1.png", true, 1),
                stayImage("gangwon/hotel1/강원1스테이(스위트룸)2.png", false, 2),
                stayImage("gangwon/hotel1/강원1스테이(스위트룸)3.png", false, 3),
                stayImage("gangwon/hotel1/강원1스테이(스위트룸)4.png", false, 4),
                stayImage("gangwon/hotel1/강원1스테이(스위트룸)5.png", false, 5)
        ));
    }

    private void seedGyeonggiSeller(MemberEntity seller) {
        SpaceEntity space = createSpace(
                seller,
                "경기 비즈니스 워케이션 호텔",
                "0311232002",
                "gyeonggi01@workation.com",
                "수도권 접근성이 좋은 비즈니스형 워케이션 호텔",
                "회의와 숙박을 함께 운영하기 좋은 경기권 도심형 워케이션 공간입니다.",
                "경기도 성남시 분당구 판교역로",
                "202",
                Area.GYEONGGI,
                "37.3947000",
                "127.1112000"
        );

        addSpacePictures(space, List.of(
                spaceImage("gyeonggi/호텔1/경기호텔외관1.png", SpacePictureCategory.EXTERIOR, true, 1),
                spaceImage("gyeonggi/호텔1/경기호텔로비1.png", SpacePictureCategory.FACILITY, false, 2),
                spaceImage("gyeonggi/호텔1/경기호텔로비2.png", SpacePictureCategory.FACILITY, false, 3),
                spaceImage("gyeonggi/호텔1/경기호텔오피스1.png", SpacePictureCategory.OFFICE, false, 4),
                spaceImage("gyeonggi/호텔1/경기호텔오피스2.png", SpacePictureCategory.OFFICE, false, 5),
                spaceImage("gyeonggi/호텔1/경기호텔주차장1.png", SpacePictureCategory.AMENITY, false, 6)
        ));

        StayEntity deluxe = createStay(
                space,
                "경기 비즈니스 디럭스룸",
                "도심 접근성과 업무 편의성을 함께 갖춘 디럭스룸",
                "판교 업무지구와 가까우며 객실 내 책상과 빠른 네트워크 환경을 제공합니다.",
                2,
                2,
                "Y",
                135000,
                175000,
                205000
        );
        addStayOptions(deluxe, StayOption.DESK, StayOption.CITY_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.COFFEE_MACHINE);
        addStayPictures(deluxe, List.of(
                stayImage("gyeonggi/호텔1/경기호텔스테이(디럭스룸)1.png", true, 1),
                stayImage("gyeonggi/호텔1/경기호텔스테이(디럭스룸)2.png", false, 2),
                stayImage("gyeonggi/호텔1/경기호텔스테이(디럭스룸)3.png", false, 3),
                stayImage("gyeonggi/호텔1/경기호텔스테이(디럭스룸)4.png", false, 4)
        ));

        StayEntity suite = createStay(
                space,
                "경기 비즈니스 스위트룸",
                "회의 전후 체류에 적합한 넓은 스위트룸",
                "라운지형 객실과 업무용 데스크를 갖춘 객실로 소규모 출장 일정에 적합합니다.",
                2,
                4,
                "Y",
                205000,
                255000,
                300000
        );
        addStayOptions(suite, StayOption.DESK, StayOption.CITY_VIEW, StayOption.BATHTUB, StayOption.REFRIGERATOR);
        addStayPictures(suite, List.of(
                stayImage("gyeonggi/호텔1/경기호텔스테이(스위트룸)1.png", true, 1),
                stayImage("gyeonggi/호텔1/경기호텔스테이(스위트룸)2.png", false, 2),
                stayImage("gyeonggi/호텔1/경기호텔스테이(스위트룸)3.png", false, 3),
                stayImage("gyeonggi/호텔1/경기호텔스테이(스위트룸)4.png", false, 4),
                stayImage("gyeonggi/호텔1/경기호텔스테이(스위트룸)5.png", false, 5)
        ));
    }

    private void seedGyeongnamSeller(MemberEntity seller) {
        SpaceEntity space = createSpace(
                seller,
                "경남 오션 워케이션 호텔",
                "0551233003",
                "gyeongnam01@workation.com",
                "바다 가까운 경남 오션 워케이션 호텔",
                "남해안 여행과 업무를 함께 즐길 수 있는 경남형 워케이션 숙소입니다.",
                "경상남도 거제시 장승포해안로",
                "303",
                Area.GYEONGNAM,
                "34.8806000",
                "128.6211000"
        );

        addSpacePictures(space, List.of(
                spaceImage("gyeongnam/호텔1/경남호텔외관1.png", SpacePictureCategory.EXTERIOR, true, 1),
                spaceImage("gyeongnam/호텔1/경남호텔외관2.png", SpacePictureCategory.EXTERIOR, false, 2),
                spaceImage("gyeongnam/호텔1/경남호텔로비1.png", SpacePictureCategory.FACILITY, false, 3),
                spaceImage("gyeongnam/호텔1/경남호텔로비2.png", SpacePictureCategory.FACILITY, false, 4),
                spaceImage("gyeongnam/호텔1/경남호텔오피스1.png", SpacePictureCategory.OFFICE, false, 5),
                spaceImage("gyeongnam/호텔1/경남호텔주차장1.png", SpacePictureCategory.AMENITY, false, 6)
        ));

        StayEntity deluxe = createStay(
                space,
                "경남 오션 디럭스룸",
                "해안과 가까운 실속형 워케이션 디럭스룸",
                "바다 근처에서 집중 업무와 휴식을 함께 누릴 수 있는 기본형 객실입니다.",
                2,
                3,
                "Y",
                125000,
                165000,
                195000
        );
        addStayOptions(deluxe, StayOption.DESK, StayOption.OCEAN_VIEW, StayOption.PRIVATE_BATHROOM, StayOption.AMENITY);
        addStayPictures(deluxe, List.of(
                stayImage("gyeongnam/호텔1/경남호텔스테이(디럭스룸)1.png", true, 1),
                stayImage("gyeongnam/호텔1/경남호텔스테이(디럭스룸)2.png", false, 2),
                stayImage("gyeongnam/호텔1/경남호텔스테이(디럭스룸)3.png", false, 3),
                stayImage("gyeongnam/호텔1/경남호텔스테이(디럭스룸)4.png", false, 4)
        ));

        StayEntity juniorSuite = createStay(
                space,
                "경남 오션 주니어스위트룸",
                "여유 있는 침실과 업무 공간을 갖춘 주니어스위트룸",
                "넓은 객실과 업무용 좌석을 갖춰 가족 동반 워케이션에도 사용할 수 있습니다.",
                2,
                4,
                "Y",
                185000,
                230000,
                270000
        );
        addStayOptions(juniorSuite, StayOption.DESK, StayOption.OCEAN_VIEW, StayOption.BATHTUB, StayOption.COFFEE_MACHINE);
        addStayPictures(juniorSuite, List.of(
                stayImage("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)1.png", true, 1),
                stayImage("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)2.png", false, 2),
                stayImage("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)3.png", false, 3),
                stayImage("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)4.png", false, 4),
                stayImage("gyeongnam/호텔1/경남호텔스테이(주니어스위트룸)5.png", false, 5)
        ));
    }

    private MemberEntity createMember(
            String username,
            String rawPassword,
            Role role,
            String name,
            String phone,
            String email
    ) {
        MemberEntity member = memberRepository.save(MemberEntity.builder()
                .username(username)
                .password(passwordEncoder.encode(rawPassword))
                .roleSet(Set.of(role))
                .build());

        profileRepository.save(MemberProfileEntity.builder()
                .member(member)
                .name(name)
                .phone(phone)
                .email(email)
                .build());

        return member;
    }

    private MemberEntity createSeller(
            String username,
            String rawPassword,
            String name,
            String phone,
            String email,
            BankEntity bank,
            String businessNo,
            String account,
            String accountName
    ) {
        MemberEntity member = createMember(username, rawPassword, Role.SELLER, name, phone, email);

        sellerRepository.save(SellerEntity.builder()
                .member(member)
                .bank(bank)
                .businessNo(businessNo)
                .account(account)
                .accountName(accountName)
                .build());

        return member;
    }

    private SpaceEntity createSpace(
            MemberEntity seller,
            String name,
            String phone,
            String email,
            String summary,
            String description,
            String address1,
            String address2,
            Area area,
            String latitude,
            String longitude
    ) {
        return spaceRepository.save(SpaceEntity.builder()
                .seller(seller)
                .name(name)
                .phone(phone)
                .email(email)
                .summary(summary)
                .description(description)
                .address1(address1)
                .address2(address2)
                .area(area)
                .latitude(new BigDecimal(latitude))
                .longitude(new BigDecimal(longitude))
                .visibleYn("Y")
                .build());
    }

    private StayEntity createStay(
            SpaceEntity space,
            String name,
            String summary,
            String description,
            int capacity,
            int maxCapa,
            String workationYn,
            int weekdayPrice,
            int fridaySundayPrice,
            int saturdayHolidayPrice
    ) {
        return stayRepository.save(StayEntity.builder()
                .space(space)
                .name(name)
                .summary(summary)
                .description(description)
                .capacity(capacity)
                .maxCapa(maxCapa)
                .checkInTime(LocalTime.of(15, 0))
                .checkOutTime(LocalTime.of(11, 0))
                .monPrice(weekdayPrice)
                .tuePrice(weekdayPrice)
                .wedPrice(weekdayPrice)
                .thuPrice(weekdayPrice)
                .friPrice(fridaySundayPrice)
                .satPrice(saturdayHolidayPrice)
                .sunPrice(fridaySundayPrice)
                .holidayPrice(saturdayHolidayPrice)
                .workationYn(workationYn)
                .build());
    }

    private void addSpacePictures(SpaceEntity space, List<SpaceImage> images) {
        spacePictureRepository.saveAll(images.stream()
                .map(image -> SpacePictureEntity.builder()
                        .space(space)
                        .filePath(image.url())
                        .originName(image.originName())
                        .storedName(image.originName())
                        .mainYn(image.mainYn())
                        .sortOrder(image.sortOrder())
                        .category(image.category())
                        .contentType(contentType(image.resourcePath()))
                        .fileSize(fileSize(image.resourcePath()))
                        .build())
                .toList());
    }

    private void addStayPictures(StayEntity stay, List<StayImage> images) {
        stayPictureRepository.saveAll(images.stream()
                .map(image -> StayPictureEntity.builder()
                        .stay(stay)
                        .filePath(image.url())
                        .originName(image.originName())
                        .storedName(image.originName())
                        .mainYn(image.mainYn())
                        .sortOrder(image.sortOrder())
                        .contentType(contentType(image.resourcePath()))
                        .fileSize(fileSize(image.resourcePath()))
                        .build())
                .toList());
    }

    private void addStayOptions(StayEntity stay, StayOption... options) {
        stayOptionRepository.saveAll(Arrays.stream(options)
                .map(option -> StayOptionEntity.builder()
                        .stay(stay)
                        .stayOption(option)
                        .build())
                .toList());
    }

    private SpaceImage spaceImage(String resourcePath, SpacePictureCategory category, boolean main, int sortOrder) {
        return new SpaceImage(resourcePath, category, main ? "Y" : "N", sortOrder);
    }

    private StayImage stayImage(String resourcePath, boolean main, int sortOrder) {
        return new StayImage(resourcePath, main ? "Y" : "N", sortOrder);
    }

    private Long fileSize(String resourcePath) {
        try {
            return Files.size(DummyImageController.IMAGE_ROOT.resolve(resourcePath).normalize());
        } catch (Exception e) {
            log.warn("[DataInitializer] Could not read image size. resourcePath={}", resourcePath, e);
            return 0L;
        }
    }

    private String contentType(String resourcePath) {
        try {
            String contentType = Files.probeContentType(DummyImageController.IMAGE_ROOT.resolve(resourcePath).normalize());
            return contentType != null ? contentType : "image/png";
        } catch (Exception e) {
            return "image/png";
        }
    }

    private record SpaceImage(String resourcePath, SpacePictureCategory category, String mainYn, int sortOrder) {
        private String url() {
            return IMAGE_URL_PREFIX + "/" + resourcePath;
        }

        private String originName() {
            int lastSlash = resourcePath.lastIndexOf('/');
            return lastSlash < 0 ? resourcePath : resourcePath.substring(lastSlash + 1);
        }
    }

    private record StayImage(String resourcePath, String mainYn, int sortOrder) {
        private String url() {
            return IMAGE_URL_PREFIX + "/" + resourcePath;
        }

        private String originName() {
            int lastSlash = resourcePath.lastIndexOf('/');
            return lastSlash < 0 ? resourcePath : resourcePath.substring(lastSlash + 1);
        }
    }
}
