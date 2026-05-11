package com.kh.app.transaction.reservation.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "RESERVE_FILE")
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ReserveFileEntity   {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ID;

    @JoinColumn(name = "RESERVATION_ID" , nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private ReservationEntity reservationEntity;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private String s3Key;

    //bucket name(파일경로)


}