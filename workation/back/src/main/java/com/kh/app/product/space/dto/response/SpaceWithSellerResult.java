package com.kh.app.product.space.dto.response;

import com.kh.app.product.space.entity.SpaceEntity;

public record SpaceWithSellerResult(
        SpaceEntity space,
        Long sellerId,
        String sellerUsername
) {}
