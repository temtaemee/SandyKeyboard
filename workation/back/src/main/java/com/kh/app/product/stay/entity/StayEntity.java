package com.kh.app.product.stay.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.product.space.entity.SpaceEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "STAY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StayEntity extends BaseEntity {

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

    @Column(name = "workation_yn", nullable = false, length = 1)
    private String workationYn;

    @Column(nullable = false)
    private LocalTime checkInTime;

    @Column(nullable = false)
    private LocalTime checkOutTime;

    @Column
    private int monPrice;
    @Column
    private int tuePrice;
    @Column
    private int wedPrice;
    @Column
    private int thuPrice;
    @Column
    private int friPrice;
    @Column
    private int satPrice;
    @Column
    private int sunPrice;
    @Column
    private int holidayPrice;

    public void changeVisibleYn(String visibleYn) {
        this.visibleYn = visibleYn;
    }

    public void update(String name, String summary, String description,
                       int capacity, int maxCapa,
                       LocalTime checkInTime, LocalTime checkOutTime,
                       int monPrice, int tuePrice, int wedPrice, int thuPrice,
                       int friPrice, int satPrice, int sunPrice, int holidayPrice,
                       String workationYn) {
        this.name = name;
        this.summary = summary;
        this.description = description;
        this.capacity = capacity;
        this.maxCapa = maxCapa;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.monPrice = monPrice;
        this.tuePrice = tuePrice;
        this.wedPrice = wedPrice;
        this.thuPrice = thuPrice;
        this.friPrice = friPrice;
        this.satPrice = satPrice;
        this.sunPrice = sunPrice;
        this.holidayPrice = holidayPrice;
        this.workationYn = workationYn;
    }
}
