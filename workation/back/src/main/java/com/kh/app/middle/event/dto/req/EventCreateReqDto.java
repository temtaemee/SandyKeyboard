package com.kh.app.middle.event.dto.req;

import lombok.Getter;

@Getter
public class EventCreateReqDto {

    private String title;
    private String content;
    private Long couponId;
}
