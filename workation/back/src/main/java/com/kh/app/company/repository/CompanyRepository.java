package com.kh.app.company.repository;

import com.kh.app.company.entity.CompanyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<CompanyEntity, Long>, CompanyRepositoryCustom {

    // 기업명 중복 여부 확인
    boolean existsByCompanyName(String companyName);

    // 사업자번호 중복 여부 확인
    boolean existsByBusinessNo(String businessNo);

    // 사업자번호 중복 여부 확인 (특정 id 제외 - 수정 시 자기 자신 제외용)
    boolean existsByBusinessNoAndIdNot(String businessNo, Long id);
}
