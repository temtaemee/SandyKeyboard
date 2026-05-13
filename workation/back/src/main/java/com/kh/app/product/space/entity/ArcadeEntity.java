package com.kh.app.product.space.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ARCADE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ArcadeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100 , nullable = false)
    private String name;

}
