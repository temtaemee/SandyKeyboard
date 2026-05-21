package com.kh.app.company.dto.req;

import com.kh.app.company.entity.CompanyEntity;
import lombok.Getter;

@Getter
public class CompanyCreateReqDto {

    private String companyName;
    private String businessNo;

    public CompanyEntity toEntity() {
        return CompanyEntity.builder()
                .companyName(companyName)
                .businessNo(businessNo)
                .build();
    }
}
