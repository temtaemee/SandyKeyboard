package com.kh.app.mypage.wishlist.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.mypage.wishlist.dto.response.WishlistListRespDto;
import com.kh.app.mypage.wishlist.entity.WishlistEntity;
import com.kh.app.mypage.wishlist.repository.WishlistRepository;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.space.entity.SpacePictureEntity;
import com.kh.app.product.space.repository.SpacePictureRepository;
import com.kh.app.product.space.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
public class WishlistService {
    private final MemberRepository memberRepository;
    private final SpaceRepository spaceRepository;
    private final WishlistRepository wishlistRepository;
    private final SpacePictureRepository spacePictureRepository;

    @Transactional
    public void insertWishlist(Long memberId, Long spaceId) {
        if (wishlistRepository.existsByMemberIdAndSpaceId(memberId, spaceId)) {
            throw new IllegalArgumentException("이미 찜한 공간입니다.");
        }
        log.info("spaceId = {}", spaceId);

        MemberEntity member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        SpaceEntity space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new RuntimeException("공간 없음"));
        log.info("space = {}", space.getId());

        WishlistEntity wishlist = WishlistEntity.builder()
                .member(member)
                .space(space)
                .createdAt(LocalDateTime.now())
                .build();

        wishlistRepository.save(wishlist);
    }

    @Transactional
    public void deleteWishlist(Long memberId, Long wishlistId) {
        WishlistEntity wishlist = wishlistRepository.findById(wishlistId)
                .orElseThrow(() -> new RuntimeException("찜 없음"));

        if (!wishlist.getMember().getId().equals(memberId)) {
            throw new RuntimeException("삭제 권한 없음");
        }
        wishlistRepository.delete(wishlist);
    }

    public List<WishlistListRespDto> getMyWishlist(Long memberId) {
        List<WishlistEntity> wishlistList =
                wishlistRepository.findByMemberId(memberId);
        return wishlistList.stream()
                .map(wishlist ->{
                    SpacePictureEntity picture = spacePictureRepository.findBySpaceIdAndMainYn(
                            wishlist.getSpace().getId(),"Y"
                    ).orElse(null);
                    String thumbnail = picture != null ? picture.getFilePath() : null;

                    return WishlistListRespDto.from(wishlist,thumbnail);
                }).toList();
    }
}
