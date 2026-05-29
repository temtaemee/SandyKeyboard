package com.kh.app.product.space.dto.request;

import com.kh.app.product.space.entity.SpacePictureCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PictureMetaReqDto {
    private String mainYn = "N";
    private Integer sortOrder = 0;
    private SpacePictureCategory category = SpacePictureCategory.OTHERS;
}
