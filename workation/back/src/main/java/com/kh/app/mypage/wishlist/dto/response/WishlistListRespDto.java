package com.kh.app.mypage.wishlist.dto.response;

import com.kh.app.mypage.wishlist.entity.WishlistEntity;
import com.kh.app.product.space.entity.SpaceEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class WishlistListRespDto {

    private Long wishlistId;
    private Long spaceId;
    private String spaceName;
    private String thumbnailUrl;
    private String address;

    public static WishlistListRespDto from(
            WishlistEntity wishlist,
            String thumbnailUrl
    ) {
        SpaceEntity space = wishlist.getSpace();

        return WishlistListRespDto.builder()
                .wishlistId(wishlist.getId())
                .spaceId(space.getId())
                .spaceName(space.getName())
                .thumbnailUrl(thumbnailUrl)
                .address(space.getAddress1())
                .build();
    }
}
