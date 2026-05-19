package com.kh.app.product;

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
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final SpaceRepository spaceRepository;
    private final SpacePictureRepository spacePictureRepository;
    private final StayRepository stayRepository;
    private final StayPictureRepository stayPictureRepository;
    private final StayOptionRepository stayOptionRepository;

    @Override
    @Transactional
    public void run(String... args) {

        if (spaceRepository.count() > 0) {
            log.info("[DataInitializer] 기존 데이터 존재 — 더미 데이터 삽입 스킵 (Space {}건)", spaceRepository.count());
            return;
        }

        log.info("[DataInitializer] 더미 데이터 삽입 시작");

        SpaceEntity jeju = spaceRepository.save(SpaceEntity.builder()
                .name("제주 바다뷰 워케이션 스페이스")
                .phone("0647771234")
                .email("jeju@workation.com")
                .summary("제주 바다가 보이는 프리미엄 워케이션 공간")
                .description("제주도 서귀포 해안가에 위치한 워케이션 전문 공간입니다. 탁 트인 바다 전망과 함께 집중적인 업무 환경을 제공합니다.")
                .address1("제주특별자치도 서귀포시 천지동")
                .address2("123-45")
                .latitude(new BigDecimal("33.2500000"))
                .longitude(new BigDecimal("126.5600000"))
                .area(Area.JEJU)
                .visibleYn("Y")
                .build());

        SpaceEntity gangwon = spaceRepository.save(SpaceEntity.builder()
                .name("강원 숲속 힐링 오피스")
                .phone("0331234567")
                .email("gangwon@workation.com")
                .summary("강원도 깊은 숲 속 고요한 업무 공간")
                .description("속초 인근 청정 자연 속에 위치한 워케이션 공간으로, 신선한 공기와 자연 소리 속에서 업무에 집중할 수 있습니다.")
                .address1("강원특별자치도 속초시 설악동")
                .address2("456-78")
                .latitude(new BigDecimal("38.2070000"))
                .longitude(new BigDecimal("128.5910000"))
                .area(Area.GANGWON)
                .visibleYn("Y")
                .build());

        SpaceEntity seoul = spaceRepository.save(SpaceEntity.builder()
                .name("서울 도심 공유 오피스")
                .phone("0221234567")
                .email("seoul@workation.com")
                .summary("강남 한복판 접근성 최고의 공유 오피스")
                .description("강남역 도보 5분 거리에 위치한 프리미엄 공유 오피스입니다. 빠른 인터넷과 최신 업무 장비를 갖추고 있습니다.")
                .address1("서울특별시 강남구 역삼동")
                .address2("테헤란로 123")
                .latitude(new BigDecimal("37.5000000"))
                .longitude(new BigDecimal("127.0300000"))
                .area(Area.SEOUL)
                .visibleYn("Y")
                .build());

        SpaceEntity busan = spaceRepository.save(SpaceEntity.builder()
                .name("부산 해운대 워케이션")
                .phone("0511234567")
                .email("busan@workation.com")
                .summary("해운대 해변가 바로 앞 워케이션 공간")
                .description("부산 해운대 해수욕장 바로 앞에 위치하여 바다를 바라보며 업무할 수 있는 최적의 환경을 제공합니다.")
                .address1("부산광역시 해운대구 중동")
                .address2("해운대해변로 200")
                .latitude(new BigDecimal("35.1587000"))
                .longitude(new BigDecimal("129.1605000"))
                .area(Area.GYEONGNAM)
                .visibleYn("Y")
                .build());

        SpaceEntity jeju2 = spaceRepository.save(SpaceEntity.builder()
                .name("제주 한라산 뷰 스테이오피스")
                .phone("0647779999")
                .email("hallasan@workation.com")
                .summary("한라산을 바라보며 일하는 감성 워케이션")
                .description("제주 중산간 지역에 위치하여 한라산 전경을 감상하며 업무에 집중할 수 있는 독립형 공간입니다.")
                .address1("제주특별자치도 제주시 애월읍")
                .address2("소길리 99")
                .latitude(new BigDecimal("33.4300000"))
                .longitude(new BigDecimal("126.3500000"))
                .area(Area.JEJU)
                .visibleYn("N")
                .build());

        // 사진 더미 데이터
        spacePictureRepository.saveAll(List.of(
                SpacePictureEntity.builder()
                        .space(jeju)
                        .filePath("/uploads/space/jeju_main.jpg")
                        .originName("jeju_main.jpg")
                        .storedName("uuid-jeju-001.jpg")
                        .mainYn("Y")
                        .sortOrder(1)
                        .category(SpacePictureCategory.EXTERIOR)
                        .contentType("image/jpeg")
                        .fileSize(204800L)
                        .build(),
                SpacePictureEntity.builder()
                        .space(jeju)
                        .filePath("/uploads/space/jeju_room.jpg")
                        .originName("jeju_room.jpg")
                        .storedName("uuid-jeju-002.jpg")
                        .mainYn("N")
                        .sortOrder(2)
                        .category(SpacePictureCategory.ROOM)
                        .contentType("image/jpeg")
                        .fileSize(153600L)
                        .build(),
                SpacePictureEntity.builder()
                        .space(gangwon)
                        .filePath("/uploads/space/gangwon_main.jpg")
                        .originName("gangwon_main.jpg")
                        .storedName("uuid-gangwon-001.jpg")
                        .mainYn("Y")
                        .sortOrder(1)
                        .category(SpacePictureCategory.EXTERIOR)
                        .contentType("image/jpeg")
                        .fileSize(307200L)
                        .build(),
                SpacePictureEntity.builder()
                        .space(seoul)
                        .filePath("/uploads/space/seoul_main.jpg")
                        .originName("seoul_main.jpg")
                        .storedName("uuid-seoul-001.jpg")
                        .mainYn("Y")
                        .sortOrder(1)
                        .category(SpacePictureCategory.FACILITY)
                        .contentType("image/jpeg")
                        .fileSize(256000L)
                        .build()
        ));

        // ===== STAY 더미 데이터 =====
        LocalDateTime checkIn  = LocalDateTime.of(2000, 1, 1, 15, 0);
        LocalDateTime checkOut = LocalDateTime.of(2000, 1, 1, 11, 0);

        // 제주 — 워케이션 Stay
        StayEntity jejuStay1 = stayRepository.save(StayEntity.builder()
                .space(jeju)
                .name("제주 오션뷰 워케이션 스위트")
                .summary("바다가 보이는 업무 특화 워케이션 룸")
                .description("넓은 책상과 고속 인터넷, 오션뷰 테라스를 갖춘 워케이션 전용 객실입니다.")
                .capacity(2).maxCapa(3)
                .checkInTime(checkIn).checkOutTime(checkOut)
                .monPrice(180000).tuePrice(180000).wedPrice(180000).thuPrice(180000)
                .friPrice(220000).satPrice(250000).sunPrice(220000).holidayPrice(250000)
                .workationYn("Y")
                .build());

        // 제주 — 일반 Stay
        StayEntity jejuStay2 = stayRepository.save(StayEntity.builder()
                .space(jeju)
                .name("제주 바다뷰 스탠다드 룸")
                .summary("가성비 좋은 제주 바다 전망 객실")
                .description("심플하고 깔끔한 인테리어, 오션뷰 창문이 있는 스탠다드 객실입니다.")
                .capacity(2).maxCapa(2)
                .checkInTime(checkIn).checkOutTime(checkOut)
                .monPrice(120000).tuePrice(120000).wedPrice(120000).thuPrice(120000)
                .friPrice(150000).satPrice(180000).sunPrice(150000).holidayPrice(180000)
                .workationYn("N")
                .build());

        // 강원 — 워케이션 Stay
        StayEntity gangwonStay1 = stayRepository.save(StayEntity.builder()
                .space(gangwon)
                .name("강원 포레스트 워케이션 캐빈")
                .summary("숲속 고요함 속 집중 업무 환경")
                .description("통나무 캐빈 스타일의 독립 공간으로, 모니터·프린터·화상회의 장비가 갖춰진 업무 전용 구역이 포함됩니다.")
                .capacity(2).maxCapa(4)
                .checkInTime(checkIn).checkOutTime(checkOut)
                .monPrice(160000).tuePrice(160000).wedPrice(160000).thuPrice(160000)
                .friPrice(200000).satPrice(230000).sunPrice(200000).holidayPrice(230000)
                .workationYn("Y")
                .build());

        // 강원 — 일반 Stay
        StayEntity gangwonStay2 = stayRepository.save(StayEntity.builder()
                .space(gangwon)
                .name("강원 힐링 더블 룸")
                .summary("자연 속 편안한 휴식을 위한 더블 룸")
                .description("숲 전망의 아늑한 더블 룸입니다. 업무 시설 없이 순수한 휴식에 집중할 수 있습니다.")
                .capacity(2).maxCapa(2)
                .checkInTime(checkIn).checkOutTime(checkOut)
                .monPrice(100000).tuePrice(100000).wedPrice(100000).thuPrice(100000)
                .friPrice(130000).satPrice(160000).sunPrice(130000).holidayPrice(160000)
                .workationYn("N")
                .build());

        // 서울 — 워케이션 Stay
        StayEntity seoulStay = stayRepository.save(StayEntity.builder()
                .space(seoul)
                .name("강남 비즈니스 워케이션 스위트")
                .summary("강남 도심 접근성 + 프리미엄 업무 환경")
                .description("미팅룸·복합기·4K 모니터가 포함된 비즈니스 특화 스위트. 강남역 도보 5분.")
                .capacity(1).maxCapa(2)
                .checkInTime(checkIn).checkOutTime(checkOut)
                .monPrice(200000).tuePrice(200000).wedPrice(200000).thuPrice(200000)
                .friPrice(230000).satPrice(260000).sunPrice(230000).holidayPrice(260000)
                .workationYn("Y")
                .build());

        // 부산 — 워케이션 Stay
        StayEntity busanStay1 = stayRepository.save(StayEntity.builder()
                .space(busan)
                .name("해운대 씨뷰 워케이션 룸")
                .summary("해운대 바다 전망 + 업무 전용 데스크")
                .description("해운대 해변이 보이는 고층 객실. 대형 책상·고속 WiFi·화이트보드가 구비된 워케이션 전용 룸.")
                .capacity(2).maxCapa(3)
                .checkInTime(checkIn).checkOutTime(checkOut)
                .monPrice(170000).tuePrice(170000).wedPrice(170000).thuPrice(170000)
                .friPrice(210000).satPrice(240000).sunPrice(210000).holidayPrice(240000)
                .workationYn("Y")
                .build());

        // 부산 — 일반 Stay
        StayEntity busanStay2 = stayRepository.save(StayEntity.builder()
                .space(busan)
                .name("해운대 오션 트윈 룸")
                .summary("2인 여행객을 위한 오션뷰 트윈 룸")
                .description("해운대 해수욕장 바로 앞. 트윈 베드와 발코니로 최적의 바다 여행을 즐기세요.")
                .capacity(2).maxCapa(2)
                .checkInTime(checkIn).checkOutTime(checkOut)
                .monPrice(130000).tuePrice(130000).wedPrice(130000).thuPrice(130000)
                .friPrice(160000).satPrice(190000).sunPrice(160000).holidayPrice(190000)
                .workationYn("N")
                .build());

        // ===== STAY_OPTION 더미 =====
        stayOptionRepository.saveAll(List.of(
                StayOptionEntity.builder().stay(jejuStay1).stayOption(StayOption.DESK).build(),
                StayOptionEntity.builder().stay(jejuStay1).stayOption(StayOption.OCEAN_VIEW).build(),
                StayOptionEntity.builder().stay(jejuStay1).stayOption(StayOption.PRIVATE_BATHROOM).build(),
                StayOptionEntity.builder().stay(jejuStay1).stayOption(StayOption.COFFEE_MACHINE).build(),

                StayOptionEntity.builder().stay(jejuStay2).stayOption(StayOption.OCEAN_VIEW).build(),
                StayOptionEntity.builder().stay(jejuStay2).stayOption(StayOption.PRIVATE_BATHROOM).build(),

                StayOptionEntity.builder().stay(gangwonStay1).stayOption(StayOption.DESK).build(),
                StayOptionEntity.builder().stay(gangwonStay1).stayOption(StayOption.MOUNTAIN_VIEW).build(),
                StayOptionEntity.builder().stay(gangwonStay1).stayOption(StayOption.KITCHEN).build(),
                StayOptionEntity.builder().stay(gangwonStay1).stayOption(StayOption.REFRIGERATOR).build(),

                StayOptionEntity.builder().stay(gangwonStay2).stayOption(StayOption.MOUNTAIN_VIEW).build(),
                StayOptionEntity.builder().stay(gangwonStay2).stayOption(StayOption.PRIVATE_BATHROOM).build(),

                StayOptionEntity.builder().stay(seoulStay).stayOption(StayOption.DESK).build(),
                StayOptionEntity.builder().stay(seoulStay).stayOption(StayOption.CITY_VIEW).build(),
                StayOptionEntity.builder().stay(seoulStay).stayOption(StayOption.COFFEE_MACHINE).build(),

                StayOptionEntity.builder().stay(busanStay1).stayOption(StayOption.DESK).build(),
                StayOptionEntity.builder().stay(busanStay1).stayOption(StayOption.OCEAN_VIEW).build(),
                StayOptionEntity.builder().stay(busanStay1).stayOption(StayOption.BATHTUB).build(),

                StayOptionEntity.builder().stay(busanStay2).stayOption(StayOption.OCEAN_VIEW).build(),
                StayOptionEntity.builder().stay(busanStay2).stayOption(StayOption.PRIVATE_BATHROOM).build()
        ));

        // ===== STAY_PICTURE 더미 (category 없음) =====
        stayPictureRepository.saveAll(List.of(
                StayPictureEntity.builder().stay(jejuStay1)
                        .filePath("/uploads/stay/jeju_w_main.jpg").originName("jeju_w_main.jpg")
                        .storedName("uuid-stay-jeju-w-001.jpg").mainYn("Y").sortOrder(1)
                        .contentType("image/jpeg").fileSize(204800L).build(),
                StayPictureEntity.builder().stay(jejuStay1)
                        .filePath("/uploads/stay/jeju_w_desk.jpg").originName("jeju_w_desk.jpg")
                        .storedName("uuid-stay-jeju-w-002.jpg").mainYn("N").sortOrder(2)
                        .contentType("image/jpeg").fileSize(153600L).build(),

                StayPictureEntity.builder().stay(jejuStay2)
                        .filePath("/uploads/stay/jeju_s_main.jpg").originName("jeju_s_main.jpg")
                        .storedName("uuid-stay-jeju-s-001.jpg").mainYn("Y").sortOrder(1)
                        .contentType("image/jpeg").fileSize(184320L).build(),

                StayPictureEntity.builder().stay(gangwonStay1)
                        .filePath("/uploads/stay/gangwon_w_main.jpg").originName("gangwon_w_main.jpg")
                        .storedName("uuid-stay-gangwon-w-001.jpg").mainYn("Y").sortOrder(1)
                        .contentType("image/jpeg").fileSize(256000L).build(),

                StayPictureEntity.builder().stay(gangwonStay2)
                        .filePath("/uploads/stay/gangwon_s_main.jpg").originName("gangwon_s_main.jpg")
                        .storedName("uuid-stay-gangwon-s-001.jpg").mainYn("Y").sortOrder(1)
                        .contentType("image/jpeg").fileSize(204800L).build(),

                StayPictureEntity.builder().stay(seoulStay)
                        .filePath("/uploads/stay/seoul_w_main.jpg").originName("seoul_w_main.jpg")
                        .storedName("uuid-stay-seoul-w-001.jpg").mainYn("Y").sortOrder(1)
                        .contentType("image/jpeg").fileSize(307200L).build(),

                StayPictureEntity.builder().stay(busanStay1)
                        .filePath("/uploads/stay/busan_w_main.jpg").originName("busan_w_main.jpg")
                        .storedName("uuid-stay-busan-w-001.jpg").mainYn("Y").sortOrder(1)
                        .contentType("image/jpeg").fileSize(230400L).build(),

                StayPictureEntity.builder().stay(busanStay2)
                        .filePath("/uploads/stay/busan_s_main.jpg").originName("busan_s_main.jpg")
                        .storedName("uuid-stay-busan-s-001.jpg").mainYn("Y").sortOrder(1)
                        .contentType("image/jpeg").fileSize(204800L).build()
        ));

        log.info("[DataInitializer] 더미 데이터 삽입 완료 — Space {}건 / Stay {}건",
                spaceRepository.count(), stayRepository.count());
    }
}
