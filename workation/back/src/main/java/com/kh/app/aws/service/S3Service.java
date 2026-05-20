package com.kh.app.aws.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String upload(MultipartFile file , String folder) throws IOException {

        String ext = extractExtension(file.getOriginalFilename());
        String s3key = folder + "/" + UUID.randomUUID() + ext;

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(s3key)
                        .contentType(file.getContentType())
                        .contentLength(file.getSize())
                        .build() ,
                RequestBody.fromBytes( file.getBytes() )
        );
        return s3key;
    }

    private String extractExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {return "";}
        return originalFilename.substring(originalFilename.lastIndexOf("."));
    }

    public void delete(String s3Key) {

        s3Client.deleteObject(
                DeleteObjectRequest.builder()
                        .bucket(bucket)
                        .key(s3Key)
                        .build()
        );

        log.info("S3 삭제 완료 key={}", s3Key);
    }
}
