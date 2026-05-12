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
    private SpaceEntity spaceId;

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

    @Enumerated(EnumType.STRING)
    @Column(name = "CATEGORY", length = 100, nullable = false)
    private SpacePictureEntity category; // 아까 만든 Enum 타입 사용


}



