package com.kh.app.product.stay.entity;


import com.kh.app.product.space.entity.Area;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "STAY_OPTION")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StayOptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STAY_ID")
    private StayEntity stay;

    @Enumerated(EnumType.STRING)
    @Column(name = "stay_option", nullable = false)
    private StayOption stayOption;

}
