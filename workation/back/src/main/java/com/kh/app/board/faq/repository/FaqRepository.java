package com.kh.app.board.faq.repository;

import com.kh.app.board.faq.entity.FaqEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FaqRepository extends JpaRepository<FaqEntity, Long> {

    List<FaqEntity> findAllByDelYnOrderByCreatedAtDesc(String delYn);

    Optional<FaqEntity> findByIdAndDelYn(Long id, String delYn);
}