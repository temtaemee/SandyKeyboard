package com.kh.app.company.service;

import com.kh.app.company.dto.req.CompanyCreateReqDto;
import com.kh.app.company.dto.resp.CompanyRespDto;
import com.kh.app.company.entity.CompanyEntity;
import com.kh.app.company.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

    private final CompanyRepository companyRepository;

    @Transactional
    public void create(CompanyCreateReqDto dto) {
        CompanyEntity entity = dto.toEntity();
        companyRepository.save(entity);
    }

    @Transactional
    public void update(Long id, CompanyCreateReqDto dto) {
        CompanyEntity entity = companyRepository.findById(id).orElseThrow();
        entity.update(dto);
    }

    @Transactional
    public void toggleStatus(Long id) {
        CompanyEntity entity = companyRepository.findById(id).orElseThrow();
        entity.toggleStatus();
    }

    public Page<CompanyRespDto> listAll(int pno) {
        Pageable pageable = PageRequest.of(pno, 10);
        return companyRepository.getList(pageable).map(CompanyRespDto::from);
    }
}
