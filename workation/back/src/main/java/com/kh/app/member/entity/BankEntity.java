package com.kh.app.member.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "BANK")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BankEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BANK_ID")
    private Long bankId;

    @Column(name = "BANK_NAME", unique = true,nullable = false, length = 20)
    private String bankName; // 은행명 (예: 국민은행, 신한은행...)

    // 초기 데이터 삽입 등을 위한 생성자나 메서드
}
