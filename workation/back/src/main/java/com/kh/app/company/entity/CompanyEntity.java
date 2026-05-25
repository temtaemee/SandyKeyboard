package com.kh.app.company.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.company.dto.req.CompanyCreateReqDto;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "COMPANY")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CompanyEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "COMPANY_NAME", length = 100, nullable = false)
    private String companyName;

    @Column(name = "BUSINESS_NO", length = 50)
    private String businessNo;

    public void update(CompanyCreateReqDto dto){
        this.companyName = dto.getCompanyName();
        this.businessNo = dto.getBusinessNo();
    }

    public void toggleStatus() {
        this.delYn = "Y".equals(this.delYn) ? "N" : "Y";
    }


}