package com.kh.app.product.office.entity;

import com.kh.app.product.stay.entity.StayEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "OFFICE_PICTURE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class OfficePictureEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "OFFICE_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private OfficeEntity office;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String filePath;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String originName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String storedName;

    @Column(nullable = false, length = 1)
    private String mainYn; // 'Y' 또는 'N'

    @Column(nullable = false)
    private Integer sortOrder;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Long fileSize;



}



