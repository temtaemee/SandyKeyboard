package com.kh.app.middle.event.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.middle.coupon.repository.CouponRepository;
import com.kh.app.middle.event.dto.req.EventCreateReqDto;
import com.kh.app.middle.event.dto.resp.EventRespDto;
import com.kh.app.middle.event.entity.EventEntity;
import com.kh.app.middle.event.repository.EventRepository;
import com.kh.app.middle.exception.ErrorCode;
import com.kh.app.middle.exception.MiddleException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;
    private final MemberRepository memberRepository;
    private final CouponRepository couponRepository;

    @Transactional
    public void create(EventCreateReqDto dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        MemberEntity member = memberRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> new MiddleException(ErrorCode.MEMBER_NOT_FOUND));

        CouponEntity coupon = null;
        if (dto.getCouponId() != null) {
            coupon = couponRepository.findByIdAndDelYn(dto.getCouponId(), "N")
                    .orElseThrow(() -> new MiddleException(ErrorCode.NOT_EXIST_COUPON));
        }

        eventRepository.save(EventEntity.builder()
                .member(member)
                .title(dto.getTitle())
                .content(dto.getContent())
                .coupon(coupon)
                .build());
    }

    @Transactional
    public void update(Long eventId, EventCreateReqDto dto) {
        EventEntity entity = eventRepository.findByIdAndDelYn(eventId, "N")
                .orElseThrow(() -> new MiddleException(ErrorCode.EVENT_NOT_FOUND));

        CouponEntity coupon = null;
        if (dto.getCouponId() != null) {
            coupon = couponRepository.findByIdAndDelYn(dto.getCouponId(), "N")
                    .orElseThrow(() -> new MiddleException(ErrorCode.NOT_EXIST_COUPON));
        }
        entity.update(dto.getTitle(), dto.getContent(), coupon);
    }

    @Transactional
    public void delete(Long eventId) {
        EventEntity entity = eventRepository.findByIdAndDelYn(eventId, "N")
                .orElseThrow(() -> new MiddleException(ErrorCode.EVENT_NOT_FOUND));
        entity.delete();
    }

    public Page<EventRespDto> getList(int pno) {
        Pageable pageable = PageRequest.of(pno, 10);
        return eventRepository.getList(pageable).map(EventRespDto::from);
    }

    public Page<EventRespDto> getListAll(int pno) {
        Pageable pageable = PageRequest.of(pno, 10);
        return eventRepository.getListAll(pageable).map(EventRespDto::from);
    }

    public EventRespDto getOne(Long eventId) {
        EventEntity entity = eventRepository.findByIdAndDelYn(eventId, "N")
                .orElseThrow(() -> new MiddleException(ErrorCode.EVENT_NOT_FOUND));
        return EventRespDto.from(entity);
    }
}
