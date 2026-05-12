package com.kh.app.member.repository;

import com.kh.app.member.entity.BankEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankRepository extends JpaRepository<BankEntity,Long> {
}
