package com.kh.app.product.office.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.product.exception.ErrorCode;
import com.kh.app.product.exception.ProductException;
import com.kh.app.product.office.dto.request.OfficeInsertReqDto;
import com.kh.app.product.office.dto.request.OfficeUpdateReqDto;
import com.kh.app.product.office.dto.response.OfficeResDto;
import com.kh.app.product.office.entity.OfficeEntity;
import com.kh.app.product.office.entity.OfficeOption;
import com.kh.app.product.office.entity.OfficeOptionEntity;
import com.kh.app.product.office.entity.OfficePictureEntity;
import com.kh.app.product.office.repository.OfficeOptionRepository;
import com.kh.app.product.office.repository.OfficePictureRepository;
import com.kh.app.product.office.repository.OfficeRepository;
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
public class OfficeService {

    private final OfficeRepository officeRepository;
    private final OfficePictureRepository officePictureRepository;
    private final OfficeOptionRepository officeOptionRepository;
    private final SpaceRepository spaceRepository;
    private final S3Service s3Service;

    public List<OfficeResDto> selectAll() {
        return officeRepository.findAllByDelYn("N").stream()
                .map(office -> {
                    List<OfficeOptionEntity> options = officeOptionRepository.findByOffice(office);
                    List<OfficePictureEntity> pictures = officePictureRepository.findByOfficeOrderBySortOrder(office);
                    return OfficeResDto.from(office, options, pictures);
                })
                .toList();
    }

    public OfficeResDto selectOne(Long id) {
        OfficeEntity office = findOffice(id);
        List<OfficeOptionEntity> options = officeOptionRepository.findByOffice(office);
        List<OfficePictureEntity> pictures = officePictureRepository.findByOfficeOrderBySortOrder(office);
        return OfficeResDto.from(office, options, pictures);
    }

    @Transactional
    public Long insert(OfficeInsertReqDto dto, List<MultipartFile> files) {
        var space = spaceRepository.findByIdAndDelYn(dto.getSpaceId(), "N")
                .orElseThrow(() -> new ProductException(ErrorCode.SPACE_NOT_FOUND));

        OfficeEntity office = officeRepository.save(dto.toEntity(space));
        saveOptions(office, dto.getOptionList());
        uploadAndSavePictures(office, files);

        return office.getId();
    }

    @Transactional
    public void update(Long id, OfficeUpdateReqDto dto) {
        OfficeEntity office = findOffice(id);
        office.update(
                dto.getName(), dto.getSummary(), dto.getDescription(),
                dto.getCapacity(), dto.getMaxCapa(),
                dto.getTimePrice(), dto.getOfficeType()
        );
        officeOptionRepository.deleteAllByOffice(office);
        saveOptions(office, dto.getOptionList());
    }

    @Transactional
    public void changeVisibleYn(Long id, String visibleYn) {
        findOffice(id).changeVisibleYn(visibleYn);
    }

    @Transactional
    public void delete(Long id) {
        findOffice(id).delete();
    }

    private void saveOptions(OfficeEntity office, List<OfficeOption> optionList) {
        if (optionList == null || optionList.isEmpty()) return;
        List<OfficeOptionEntity> entities = optionList.stream()
                .map(opt -> OfficeOptionEntity.builder().office(office).officeOption(opt).build())
                .toList();
        officeOptionRepository.saveAll(entities);
    }

    private OfficeEntity findOffice(Long id) {
        return officeRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new ProductException(ErrorCode.OFFICE_NOT_FOUND));
    }

    private void uploadAndSavePictures(OfficeEntity office, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return;

        List<OfficePictureEntity> entities = new ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            try {
                String s3key = s3Service.upload(file, "office");
                String storedName = s3key.substring(s3key.lastIndexOf("/") + 1);
                entities.add(OfficePictureEntity.builder()
                        .office(office)
                        .filePath(s3key)
                        .originName(file.getOriginalFilename())
                        .storedName(storedName)
                        .contentType(file.getContentType())
                        .fileSize(file.getSize())
                        .mainYn(i == 0 ? "Y" : "N")
                        .sortOrder(i)
                        .build());
            } catch (IOException e) {
                log.error("S3 upload failed for file: {}", file.getOriginalFilename(), e);
                throw new ProductException(ErrorCode.FILE_UPLOAD_FAILED);
            }
        }
        officePictureRepository.saveAll(entities);
    }
}
