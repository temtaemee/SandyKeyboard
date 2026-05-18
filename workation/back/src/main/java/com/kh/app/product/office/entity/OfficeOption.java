package com.kh.app.product.office.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OfficeOption {

    // 작업환경
    POWER_STRIP("멀티탭"),
    MONITOR_PROVIDED("모니터 제공"),
    STANDING_DESK("스탠딩 데스크"),
    ERGONOMIC_CHAIR("인체공학 의자"),

    // 인터넷
    WIRED_INTERNET("유선 인터넷"),
    WIFI("무선 인터넷(WiFi)"),

    // 출력/장비
    PRINTER("프린터"),
    SCANNER("스캐너"),
    MULTIFUNCTION_PRINTER("복합기"),

    // 회의장비
    PROJECTOR("프로젝터"),
    WHITEBOARD("화이트보드"),
    TV_SCREEN("TV/스크린"),
    VIDEO_CONFERENCE("화상회의 장비"),

    // 편의시설
    COFFEE_MACHINE("커피머신"),
    WATER_PURIFIER("정수기"),
    REFRIGERATOR("냉장고"),
    MICROWAVE("전자레인지"),
    SHARED_KITCHEN("공용 주방"),

    // 서비스
    RECEPTION("리셉션"),
    MAIL_SERVICE("우편/택배 수령"),
    LOCKER("개인 사물함"),

    // 기타
    PARKING("주차"),
    SHOWER("샤워실"),
    LOUNGE("휴게공간");

    private final String description;
}
