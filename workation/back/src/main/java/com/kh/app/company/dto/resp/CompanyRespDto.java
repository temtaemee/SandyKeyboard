package com.kh.app.company.dto.resp;

import com.kh.app.company.entity.CompanyEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class CompanyRespDto {


    private Long id;
    private String companyName;
    private String businessNo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String delYn; // 활성비활성

    public static CompanyRespDto from(CompanyEntity entity){
        return CompanyRespDto.builder()
                .id(entity.getId())
                .companyName(entity.getCompanyName())
                .businessNo(entity.getBusinessNo())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .delYn(entity.getDelYn())
                .build();
    }

}
