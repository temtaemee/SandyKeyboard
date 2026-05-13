package com.kh.app.product.office.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.stay.entity.StayOption;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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
    @ManyToOne
    private SpaceEntity space;

    @Column(length = 100 , nullable = false , unique = true)
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
    private LocalDateTime checkInTime;

    @Column(nullable = false)
    private LocalDateTime checkOutTime;

    @Column()
    private int timePrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "office_type", nullable = false)
    private OfficeType officeType;

    public void changeVisibleYn(String visibleYn) {
        this.visibleYn = visibleYn;
    }


}
