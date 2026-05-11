package com.kh.app.product.space.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SPACE_ARCADE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class SpaceArcadeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "SPACE_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private SpaceEntity spaceId;

    @JoinColumn(name = "ARCADE", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private ArcadeEntity arcadeId;

}
