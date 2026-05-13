package com.kh.app.product.space.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "SPACE_PICTURE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class SpacePictureEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "SPACE_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private SpaceEntity space;

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

    @Enumerated(EnumType.STRING)
    @Column(length = 100, nullable = false)
    private SpacePictureCategory category;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Long fileSize;


}



