package com.kh.app.middle.coupon.repository;

import com.kh.app.middle.coupon.entity.CouponEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.nio.channels.FileChannel;

public interface CouponRepositoryCustom {
    Page<CouponEntity> getList(Pageable pageable);
}
