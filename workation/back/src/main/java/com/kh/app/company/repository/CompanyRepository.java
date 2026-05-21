package com.kh.app.company.repository;

import com.kh.app.company.entity.CompanyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<CompanyEntity, Long>, CompanyRepositoryCustom {
}
