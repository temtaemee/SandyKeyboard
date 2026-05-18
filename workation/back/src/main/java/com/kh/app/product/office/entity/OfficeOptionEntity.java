package com.kh.app.product.office.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "OFFICE_OPTION")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class OfficeOptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OFFICE_ID")
    private OfficeEntity office;

    @Enumerated(EnumType.STRING)
    @Column(name = "OFFICE_OPTION", nullable = false)
    private OfficeOption officeOption;
}
