package com.kh.app.product.space.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SpacePictureUpdateReqDto {
    /** 유지할 기존 사진 ID 목록 (목록에 없는 기존 사진은 삭제) */
    private List<Long> keepPictureIds;
    /** 새로 업로드할 사진 메타데이터 (files 파라미터와 인덱스 순서 일치) */
    private List<PictureMetaReqDto> newPictures;
}
