package com.kh.app.product.space.dto.request;

import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.space.entity.SpacePictureCategory;
import com.kh.app.product.space.entity.SpacePictureEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "공간 사진 요청 DTO")
public class SpacePictureReqDto {

    @Schema(description = "파일 저장 경로", example = "/uploads/space/abc.jpg")
    private String filePath;

    @Schema(description = "원본 파일명", example = "photo.jpg")
    private String originName;

    @Schema(description = "저장 파일명 (UUID 등)", example = "550e8400-e29b-41d4-a716-446655440000.jpg")
    private String storedName;

    @Schema(description = "MIME 타입", example = "image/jpeg")
    private String contentType;

    @Schema(description = "파일 크기 (bytes)", example = "204800")
    private Long fileSize;

    @Schema(description = "대표 사진 여부 (Y/N)", example = "N")
    @Pattern(regexp = "^[YN]$", message = "mainYn은 Y 또는 N만 허용됩니다.")
    private String mainYn;

    @Schema(description = "정렬 순서", example = "1")
    private Integer sortOrder;

    @Schema(description = "사진 카테고리", example = "EXTERIOR")
    private SpacePictureCategory category;

    public SpacePictureEntity toEntity(SpaceEntity space) {

        return SpacePictureEntity.builder()
                .space(space)
                .filePath(filePath)
                .originName(originName)
                .storedName(storedName)
                .contentType(contentType)
                .fileSize(fileSize)
                .mainYn(mainYn)
                .sortOrder(sortOrder)
                .category(category)
                .build();
    }



}
