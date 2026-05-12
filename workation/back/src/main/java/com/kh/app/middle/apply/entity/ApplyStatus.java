package com.kh.app.middle.apply.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ApplyStatus {
     P("PENDING") ,A("APPROVED"), R("REJECTED");

    private final String code;
}
