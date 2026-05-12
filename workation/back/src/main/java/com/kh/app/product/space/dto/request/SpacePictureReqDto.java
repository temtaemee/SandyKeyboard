package com.kh.app.product.space.dto.request;

import com.kh.app.product.space.entity.SpacePictureCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SpacePictureReqDto {

    private String filePath;

    private String originName;

    private String storedName;

    private String contentType;

    private Long fileSize;

    private String mainYn;

    private Integer sortOrder;

    private SpacePictureCategory category;

}
