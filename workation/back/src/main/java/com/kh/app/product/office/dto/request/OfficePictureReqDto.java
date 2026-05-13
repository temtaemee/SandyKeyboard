package com.kh.app.product.office.dto.request;

import com.kh.app.product.office.entity.OfficeEntity;
import com.kh.app.product.office.entity.OfficePictureEntity;
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

    public OfficePictureEntity toEntity(OfficeEntity office) {

        return OfficePictureEntity.builder()
                .office(office)
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
