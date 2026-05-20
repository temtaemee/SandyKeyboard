package com.kh.app.mypage.wishlist.controller;

import com.kh.app.mypage.wishlist.dto.response.WishlistListRespDto;
import com.kh.app.mypage.wishlist.service.WishlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
public class WishlistApiController {
    private final WishlistService wishlistService;

    @PostMapping("/user/wishlist/{spaceId}")
    public ResponseEntity<Void> insertWishlist(
            @PathVariable Long spaceId,
            @AuthenticationPrincipal(expression = "memberId") Long memberId
    ){
        wishlistService.insertWishlist(memberId,spaceId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/wishlist/{wishlistId}")
    public ResponseEntity<Void> deleteWishlist(
            @PathVariable Long wishlistId,
            @AuthenticationPrincipal(expression = "memberId") Long memberId
    ){
        wishlistService.deleteWishlist(memberId,wishlistId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/user/wishlist")
    public ResponseEntity<List<WishlistListRespDto>> getMyWishlist(@AuthenticationPrincipal(expression = "memberId") Long memberId){
        List<WishlistListRespDto> myWishlist = wishlistService.getMyWishlist(memberId);
        return ResponseEntity.ok(myWishlist);
    }

}
