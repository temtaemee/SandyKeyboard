package com.kh.app.company.repository;

import com.kh.app.company.entity.CompanyEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface CompanyRepositoryCustom {
    Page<CompanyEntity> getList(Pageable pageable);
}
