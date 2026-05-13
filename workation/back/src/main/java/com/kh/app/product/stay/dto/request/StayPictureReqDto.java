package com.kh.app.product.stay.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StayPictureReqDto {

    private String filePath;

    private String originName;

    private String storedName;

    private String contentType;

    private Long fileSize;

    private String mainYn;

    private Integer sortOrder;


}