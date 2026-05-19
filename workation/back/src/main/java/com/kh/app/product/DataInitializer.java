package com.kh.app.product;

import com.kh.app.product.space.entity.Area;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.space.entity.SpacePictureCategory;
import com.kh.app.product.space.entity.SpacePictureEntity;
import com.kh.app.product.space.repository.SpacePictureRepository;
import com.kh.app.product.space.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final SpaceRepository spaceRepository;
    private final SpacePictureRepository spacePictureRepository;

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

        log.info("[DataInitializer] 더미 데이터 삽입 완료 — Space {}건", spaceRepository.count());
    }
}
