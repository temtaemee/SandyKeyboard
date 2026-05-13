package com.kh.app.company.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    @Column(name = "DEL_YN", length = 1, nullable = false)
    private String delYn;


    @PrePersist
    public void prePersist() {
        delYn = "N";
        createdAt = LocalDateTime.now();
    }
}