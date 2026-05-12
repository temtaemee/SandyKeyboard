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
    private OfficeEntity offieId;

    @Column(name = "FILE_PATH", columnDefinition = "TEXT", nullable = false)
    private String filePath;

    @Column(name = "ORIGIN_NAME", columnDefinition = "TEXT", nullable = false)
    private String originName;

    @Column(name = "STORED_NAME", columnDefinition = "TEXT", nullable = false)
    private String storedName;

    @Column(name = "MAIN_YN", columnDefinition = "CHAR(1)", nullable = false)
    private String mainYn; // 'Y' 또는 'N'

    @Column(name = "SORT_ORDER", nullable = false)
    private Integer sortOrder;



}



