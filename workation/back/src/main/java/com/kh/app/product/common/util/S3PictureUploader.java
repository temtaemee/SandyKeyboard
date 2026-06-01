package com.kh.app.product.common.util;

import com.kh.app.aws.service.S3Service;
import com.kh.app.product.exception.ErrorCode;
import com.kh.app.product.exception.ProductException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * S3 파일 업로드 공통 유틸리티.
 * <p>
 * SpaceService / StayService 에서 중복 구현된 S3 업로드 로직을 통합한다.
 * 반환값은 업로드된 S3 key 목록이며, 호출 측에서 엔티티 조합에 활용한다.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class S3PictureUploader {

    private final S3Service s3Service;

    /**
     * 파일 목록을 S3에 업로드하고 S3 key 목록을 반환한다.
     *
     * @param files     업로드할 파일 목록 (null 또는 빈 리스트이면 빈 목록 반환)
     * @param dirPrefix S3 폴더명 (예: "space", "stay")
     * @return 업로드된 S3 key 목록 (파일 순서 유지)
     * @throws ProductException FILE_UPLOAD_FAILED — S3 업로드 실패 시
     */
    public String getFileUrl(String s3Key) {
        if (s3Key == null) return null;
        return s3Service.getFileUrl(s3Key);
    }

    public List<String> upload(List<MultipartFile> files, String dirPrefix) {
        if (files == null || files.isEmpty()) {
            return List.of();
        }

        List<String> s3Keys = new ArrayList<>(files.size());
        for (MultipartFile file : files) {
            try {
                String s3Key = s3Service.upload(file, dirPrefix);
                s3Keys.add(s3Key);
            } catch (IOException e) {
                log.error("S3 upload failed for file: {}", file.getOriginalFilename(), e);
                throw new ProductException(ErrorCode.FILE_UPLOAD_FAILED);
            }
        }
        return s3Keys;
    }
}
