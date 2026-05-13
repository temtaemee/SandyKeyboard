package com.kh.app.product.office.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OfficeType {
    // 좌석 및 작업 환경
    ASSIGNED_SEAT("지정석"),
    PRIVATE_ROOM("프라이빗 룸"),
    LOUNGE_SEAT("라운지석"),
    POWER_STRIP("멀티탭"),
    PRINTER("프린터"),
    WIRED_INTERNET("유선 인터넷"),
    MONITOR_PROVIDED("모니터 제공"),

    // 회의 및 인터뷰 공간
    MEETING_ROOM("미팅룸"),
    CONFERENCE_ROOM("컨퍼런스룸"),
    SEMINAR_ROOM("세미나룸"),
    BOARD_ROOM("보드룸"),
    BRAINSTORMING_ROOM("브레인스토밍룸"),
    INTERVIEW_ROOM("인터뷰룸"),

    // 교육 및 워크샵 공간
    TRAINING_ROOM("교육실"),
    WORKSHOP_ROOM("워크샵룸"),

    // 대규모 행사 및 연회 공간
    BALLROOM("볼룸(Ballroom)"),
    BANQUET_HALL("연회장(Banquet Hall)"),
    CONVENTION_HALL("컨벤션홀"),
    EVENT_HALL("이벤트홀"),
    GRAND_HALL("그랜드홀"),
    MULTI_HALL("멀티홀");

    private final String description;
}
