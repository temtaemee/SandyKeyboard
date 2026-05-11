package com.kh.app.product.stay.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "STAY_EXTRA_PRICE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StayExtraPriceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "STAY_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private StayEntity stayId;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @Column()
    private int monPrice;
    @Column()
    private int tuePrice;
    @Column()
    private int wedPrice;
    @Column()
    private int thuPrice;
    @Column()
    private int friPrice;
    @Column()
    private int satPrice;
    @Column()
    private int sunPrice;

}
