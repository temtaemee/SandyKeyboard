package com.kh.app.mypage.wishlist.repository;

import com.kh.app.mypage.wishlist.entity.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepository extends JpaRepository<WishlistEntity,Long> {
    boolean existsByMemberIdAndSpaceId(Long memberId, Long spaceId);

    List<WishlistEntity> findByMemberId(Long memberId);
}
