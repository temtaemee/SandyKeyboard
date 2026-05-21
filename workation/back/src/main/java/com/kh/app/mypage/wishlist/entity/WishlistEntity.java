package com.kh.app.mypage.wishlist.entity;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.product.space.entity.SpaceEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "WISHLIST",
        uniqueConstraints = {
        @UniqueConstraint(columnNames = {"member_id","space_id"})
        })
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 찜한 회원
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private MemberEntity member;

    // 찜한 상품
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id")
    private SpaceEntity space;

    private LocalDateTime createdAt;
}