package com.kh.app.product.office.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.product.space.entity.SpaceEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "OFFICE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class OfficeEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "SPACE_ID")
    @ManyToOne(fetch = FetchType.LAZY)
    private SpaceEntity space;

    @Column(length = 100, nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String summary;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false)
    private int maxCapa;

    @Column(nullable = false, length = 1)
    @Builder.Default
    private String visibleYn = "Y";

    @Column(nullable = false)
    private int timePrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "office_type", nullable = false)
    private OfficeType officeType;

    public void changeVisibleYn(String visibleYn) {
        this.visibleYn = visibleYn;
    }

    public void update(String name, String summary, String description,
                       int capacity, int maxCapa,
                       int timePrice, OfficeType officeType) {
        this.name = name;
        this.summary = summary;
        this.description = description;
        this.capacity = capacity;
        this.maxCapa = maxCapa;
        this.timePrice = timePrice;
        this.officeType = officeType;
    }
}
