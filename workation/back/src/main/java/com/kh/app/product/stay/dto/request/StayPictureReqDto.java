package com.kh.app.product.stay.dto.request;

import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.entity.StayPictureEntity;
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

    public StayPictureEntity toEntity(StayEntity stay) {
        return StayPictureEntity.builder()
                .stay(stay)
                .filePath(filePath)
                .originName(originName)
                .storedName(storedName)
                .contentType(contentType)
                .fileSize(fileSize)
                .mainYn(mainYn)
                .sortOrder(sortOrder)
                .build();
    }
}
