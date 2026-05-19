package com.kh.app.product.stay.entity;

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

    @Column(nullable = false, length = 1)
    private String mainYn;

    @Column(nullable = false)
    private Integer sortOrder;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Long fileSize;
}
