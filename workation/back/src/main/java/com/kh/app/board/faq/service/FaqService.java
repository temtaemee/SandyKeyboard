package com.kh.app.board.faq.service;

import com.kh.app.board.faq.dto.request.FaqCreateReqDto;
import com.kh.app.board.faq.dto.request.FaqUpdateReqDto;
import com.kh.app.board.faq.dto.response.FaqRespDto;
import com.kh.app.board.faq.entity.FaqEntity;
import com.kh.app.board.faq.repository.FaqRepository;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class FaqService {

    private final FaqRepository faqRepository;
    private final MemberRepository memberRepository;

    public List<FaqRespDto> findAll() {
        return faqRepository.findAllByDelYnOrderByCreatedAtDesc("N")
                .stream()
                .map(FaqRespDto::from)
                .toList();
    }

    @Transactional
    public Long create(FaqCreateReqDto dto) {
        MemberEntity member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));
        FaqEntity faq = dto.toEntity(member);
        faqRepository.save(faq);
        return faq.getId();
    }

    @Transactional
    public void update(Long id, FaqUpdateReqDto dto) {
        FaqEntity faq = faqRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new IllegalArgumentException("FAQ를 찾을 수 없습니다."));
        faq.update(dto.getQuestion(), dto.getAnswer());
    }

    @Transactional
    public void delete(Long id) {
        FaqEntity faq = faqRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new IllegalArgumentException("FAQ를 찾을 수 없습니다."));
        faq.delete();
    }
}
