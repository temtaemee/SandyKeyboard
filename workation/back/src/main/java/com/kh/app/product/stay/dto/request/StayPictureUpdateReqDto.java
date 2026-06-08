package com.kh.app.product.stay.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StayPictureUpdateReqDto {
    /** 유지할 기존 사진 ID 목록 — 배열 순서 = 새 sortOrder */
    private List<Long> keepPictureIds;
    /** 대표 사진으로 지정할 기존 사진 ID */
    private Long mainPictureId;
    /** 새로 업로드할 사진 메타데이터 (files 파라미터와 인덱스 순서 일치) */
    private List<NewPictureMeta> newPictures;

    @Getter
    @Setter
    public static class NewPictureMeta {
        private String mainYn;
    }
}
