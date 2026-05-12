package com.kh.app.product.office.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OfficePictureReqDto {

    private String filePath;

    private String originName;

    private String storedName;

    private String contentType;

    private Long fileSize;

    private String mainYn;

    private Integer sortOrder;

}
