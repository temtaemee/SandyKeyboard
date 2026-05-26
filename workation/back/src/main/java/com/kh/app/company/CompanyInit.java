package com.kh.app.company;

import com.kh.app.company.entity.CompanyEntity;
import com.kh.app.company.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class CompanyInit implements CommandLineRunner {

    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public void run(String... args) {
        initCompany("kh 정보교육원", "111-22-33333");
        initCompany("네이버웹툰", "222-33-44444");
        initCompany("카카오페이", "333-44-55555");
        initCompany("토스뱅크", "444-55-66666");
    }

    private void initCompany(String name, String businessNo) {
        if (companyRepository.existsByCompanyName(name)) {
            log.info("[CompanyInit] 파트너사 '{}' 이미 존재 — 삽입 스킵", name);
            return;
        }

        companyRepository.save(CompanyEntity.builder()
                .companyName(name)
                .businessNo(businessNo)
                .build());

        log.info("[CompanyInit] 파트너사 '{}' 삽입 완료", name);
    }
}
