package com.kh.app.product.space.service;

import com.kh.app.product.exception.ErrorCode;
import com.kh.app.product.exception.ProductException;
import com.kh.app.product.space.dto.request.SpaceInsertReqDto;
import com.kh.app.product.space.dto.request.SpacePictureReqDto;
import com.kh.app.product.space.dto.request.SpaceUpdateReqDto;
import com.kh.app.product.space.dto.response.SpaceResDto;
import com.kh.app.product.space.entity.ArcadeEntity;
import com.kh.app.product.space.entity.SpaceArcadeEntity;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.space.entity.SpacePictureEntity;
import com.kh.app.product.space.repository.SpaceArcadeRepository;
import com.kh.app.product.space.repository.SpacePictureRepository;
import com.kh.app.product.space.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
public class SpaceService {

    private final SpaceRepository spaceRepository;
    private final SpaceArcadeRepository spaceArcadeRepository;
    private final SpacePictureRepository spacePictureRepository;

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
    public Long insert(SpaceInsertReqDto dto) {

        SpaceEntity space = dto.toEntity();

        SpaceEntity save = spaceRepository.save(space);

        insertPictures(save, dto.getPictureList());

        insertArcades(space, dto.getArcadeIdList());

        return space.getId();
    }

    //    insertPicture 처리
    private void insertPictures(
            SpaceEntity space,
            List<SpacePictureReqDto> pictureList
    ) {

        if (pictureList == null || pictureList.isEmpty()) {
            return;
        }

        List<SpacePictureEntity> entityList =
                pictureList.stream()
                        .map(dto -> dto.toEntity(space))
                        .toList();

        spacePictureRepository.saveAll(entityList);
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
