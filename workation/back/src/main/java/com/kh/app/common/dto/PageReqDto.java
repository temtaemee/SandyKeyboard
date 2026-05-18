package com.kh.app.common.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PageReqDto {

    private int page = 1;
    private int size = 10;

    public long getOffset() {
        return (long) (page - 1) * size;
    }

}
