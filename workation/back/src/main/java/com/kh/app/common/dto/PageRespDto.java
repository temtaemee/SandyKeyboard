package com.kh.app.common.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class PageRespDto<T> {

    private List<T> content;

    private int currentPage;
    private int size;

    private long totalCount;
    private int totalPage;

}
