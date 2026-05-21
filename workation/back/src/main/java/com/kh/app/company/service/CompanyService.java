package com.kh.app.company.service;

import com.kh.app.company.dto.req.CompanyCreateReqDto;
import com.kh.app.company.entity.CompanyEntity;
import com.kh.app.company.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
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
}
