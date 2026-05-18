package com.kh.app.product.space.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.product.exception.ErrorCode;
import com.kh.app.product.exception.ProductException;
import com.kh.app.product.space.dto.request.SpaceInsertReqDto;
import com.kh.app.product.space.dto.request.SpaceUpdateReqDto;
import com.kh.app.product.space.dto.response.SpaceResDto;
import com.kh.app.product.space.entity.*;
import com.kh.app.product.space.repository.SpaceArcadeRepository;
import com.kh.app.product.space.repository.SpacePictureRepository;
import com.kh.app.product.space.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
public class SpaceService {

    private final SpaceRepository spaceRepository;
    private final SpaceArcadeRepository spaceArcadeRepository;
    private final SpacePictureRepository spacePictureRepository;
    private final S3Service s3Service;

    public List<SpaceResDto> selectAll() {
        return spaceRepository.findAllByDelYn("N")
                .stream()
                .map(SpaceResDto::from)
                .toList();
    }

    public SpaceResDto selectOne(Long id) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        return SpaceResDto.from(space);
    }

    @Transactional
    public void update(Long id, SpaceUpdateReqDto dto) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        space.update(
                dto.getName(), dto.getPhone(), dto.getEmail(),
                dto.getSummary(), dto.getDescription(),
                dto.getAddress1(), dto.getAddress2(),
                dto.getLatitude(), dto.getLongitude(), dto.getArea()
        );
    }

    @Transactional
    public void delete(Long id) {
        SpaceEntity space = spaceRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));
        space.delete();
    }

    @Transactional
    public Long insert(SpaceInsertReqDto dto, List<MultipartFile> files) {
        SpaceEntity space = spaceRepository.save(dto.toEntity());
        uploadAndSavePictures(space, files);
        insertArcades(space, dto.getArcadeIdList());
        return space.getId();
    }

    private void uploadAndSavePictures(SpaceEntity space, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return;

        List<SpacePictureEntity> entities = new ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            try {
                String s3key = s3Service.upload(file, "space");
                String storedName = s3key.substring(s3key.lastIndexOf("/") + 1);
                entities.add(SpacePictureEntity.builder()
                        .space(space)
                        .filePath(s3key)
                        .originName(file.getOriginalFilename())
                        .storedName(storedName)
                        .contentType(file.getContentType())
                        .fileSize(file.getSize())
                        .mainYn(i == 0 ? "Y" : "N")
                        .sortOrder(i)
                        .category(SpacePictureCategory.OTHERS)
                        .build());
            } catch (IOException e) {
                log.error("S3 upload failed for file: {}", file.getOriginalFilename(), e);
                throw new ProductException(ErrorCode.FILE_UPLOAD_FAILED);
            }
        }
        spacePictureRepository.saveAll(entities);
    }

    //    insertArcade 처리
    private void insertArcades(
            SpaceEntity space,
            List<Long> arcadeIdList
    ) {

        if (arcadeIdList == null || arcadeIdList.isEmpty()) {
            return;
        }

        List<SpaceArcadeEntity> entityList =
                arcadeIdList.stream()
                        .map(id ->
                                SpaceArcadeEntity.builder()
                                        .space(space)
                                        .arcade(
                                                ArcadeEntity.builder()
                                                        .id(id)
                                                        .build()
                                        )
                                        .build()
                        )
                        .toList();

        spaceArcadeRepository.saveAll(entityList);
    }

}
