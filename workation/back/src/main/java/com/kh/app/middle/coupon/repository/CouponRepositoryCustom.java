package com.kh.app.middle.coupon.repository;

import com.kh.app.middle.coupon.entity.CouponEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CouponRepositoryCustom {
    Page<CouponEntity> getList(Pageable pageable);
    List<CouponEntity> getAll();
}
