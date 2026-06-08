package com.kh.app.middle.apply.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.middle.apply.dto.req.SpaceApplyPermitReqDto;
import com.kh.app.middle.apply.dto.req.SpaceApplyReqDto;
import com.kh.app.middle.apply.dto.resp.SpaceApplyRespDto;
import com.kh.app.middle.apply.entity.ApplyStatus;
import com.kh.app.middle.apply.entity.SpaceApplyEntity;
import com.kh.app.middle.apply.repository.SpaceApplyRepository;
import com.kh.app.notification.dto.request.NotificationCreateReqDto;
import com.kh.app.notification.entity.NotificationType;
import com.kh.app.middle.exception.ErrorCode;
import com.kh.app.middle.exception.MiddleException;
import com.kh.app.notification.service.NotificationService;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.space.repository.SpaceRepository;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.repository.StayRepository;
import com.kh.app.security.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SpaceApplyService {

    private final SpaceApplyRepository spaceApplyRepository;
    private final MemberRepository memberRepository;
    private final SpaceRepository spaceRepository;
    private final NotificationService notificationService;
    private final StayRepository stayRepository;

    //등록 심사 신청
    @Transactional
    public void enroll(SpaceApplyReqDto dto, String name) {

        MemberEntity member = memberRepository.findByUsernameAndDeletedAtIsNull(name)
                .orElseThrow(() -> new MiddleException(ErrorCode.MEMBER_NOT_FOUND));

        SpaceEntity space = spaceRepository.findByIdAndDelYn(dto.getSpaceId(), "N")
                .orElseThrow(() -> new MiddleException(ErrorCode.SPACE_NOT_FOUND));

        // 중복방지신청
        boolean alreadyApplied = spaceApplyRepository.existsPendingApply(member.getId(), dto.getSpaceId());
        if(alreadyApplied){
            throw new MiddleException(ErrorCode.DUPLICATE_APPLY);
        }

        spaceApplyRepository.save(dto.toEntity(member, space));
    }


    // 신청 건 목록조회
    public Page<SpaceApplyRespDto> getApplyList(int pno, Long memberId, boolean isAdmin) {
        Pageable pageable = PageRequest.of(pno, 10);
        return spaceApplyRepository
                .getList(pageable, memberId, isAdmin)
                .map(SpaceApplyRespDto::from);
    }

    // 심사
    @Transactional
    public void update(Long applyId, SpaceApplyPermitReqDto dto) {
        SpaceApplyEntity apply = spaceApplyRepository.findByIdAndDelYn(applyId, "N")
                .orElseThrow(() -> new MiddleException(ErrorCode.APPLY_NOT_FOUND));

        //space 엔티티 찾기
        Long spaceId = apply.getSpace().getId();


        if(dto.getApplyStatus().equals(ApplyStatus.A)){
            //승인
            apply.update(dto);
            // 노출여부 변경필요
            StayEntity stayEntity = stayRepository.findByIdAndDelYn(spaceId, "N")
                    .orElseThrow(() -> new MiddleException(ErrorCode.SPACE_NOT_FOUND));
            stayEntity.changeVisibleYn("Y");

            //알림
            notificationService.createNotification(
                    NotificationCreateReqDto.builder()
                            .memberId(apply.getSeller().getId())
                            .type(NotificationType.SPACE_APPROVED)
                            .content("공간 등록 심사가 승인되었습니다.")
                            .redirectUrl("/mypage/spaces")
                            .referenceId(apply.getId())
                            .build()
            );
        }else if(dto.getApplyStatus().equals(ApplyStatus.R)){
            //거절
            apply.update(dto);

            //알림
            notificationService.createNotification(
                    NotificationCreateReqDto.builder()
                            .memberId(apply.getSeller().getId())
                            .type(NotificationType.SPACE_REJECTED)
                            .content("공간 등록 심사가 반려되었습니다.")
                            .redirectUrl("/mypage/spaces")
                            .referenceId(apply.getId())
                            .build()
            );
        }

    }
}
