package com.kh.app.product.stay.entity;

import com.kh.app.product.space.entity.Area;
import com.kh.app.product.space.entity.SpacePictureCategory;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "STAY_PICTURE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StayPictureEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private StayEntity stay;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String filePath;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String originName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String storedName;

    @Column(columnDefinition = "CHAR(1)", nullable = false)
    private String mainYn; // 'Y' 또는 'N'

    @Column(nullable = false)
    private Integer sortOrder;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private SpacePictureCategory category;



}



