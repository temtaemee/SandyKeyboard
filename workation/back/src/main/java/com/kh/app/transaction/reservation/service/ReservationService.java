package com.kh.app.transaction.reservation.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.product.office.entity.OfficeEntity;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
import com.kh.app.transaction.reservation.dto.response.ReservationResDto;
import com.kh.app.transaction.reservation.entity.ProductType;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReserveFileEntity;
import com.kh.app.transaction.reservation.repository.ReservationRepository;
import com.kh.app.transaction.reservation.repository.ReserveFileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReserveFileRepository reserveFileRepository;
    private final MemberRepository memberRepository;

    // TODO
    // stay 기능 완성 후 추가 예정
    // private final StayRepository stayRepository;

    // TODO
    // office 기능 완성 후 추가 예정
    // private final OfficeRepository officeRepository;

    // TODO
    // coupon 기능 완성 후 추가 예정
    // private final CouponRepository couponRepository;

    @Transactional
    public Long create(
            String username,
            ProductType productType,
            Long productId,
            ReservationCreateReqDto dto,
            List<MultipartFile> files
    ) {

        MemberEntity memberEntity = memberRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "MEMBER NOT FOUND"
                        )
                );

        // 날짜 검증
        if (dto.getCheckinDate().isAfter(dto.getCheckoutDate())) {

            throw new IllegalArgumentException(
                    "체크인 날짜가 체크아웃 날짜보다 늦을 수 없습니다."
            );
        }

        // TODO
        // stay / office 기능 완성 후 실제 엔티티 연결 예정

        StayEntity stay = null;
        OfficeEntity office = null;

        Long originalPrice = 0L;

        switch (productType) {

            // TODO
            // 실제 숙소 조회 및 날짜별 가격 계산 필요
            case STAY -> {

                // 임시 가격
                originalPrice = 100000L;

                log.info(
                        "임시 STAY 예약 처리 : productId={}",
                        productId
                );
            }

            // TODO
            // 실제 오피스 조회 및 시간별 가격 계산 필요
            case OFFICE -> {

                // 임시 가격
                originalPrice = 50000L;

                log.info(
                        "임시 OFFICE 예약 처리 : productId={}",
                        productId
                );
            }
        }

        // TODO
        // coupon 기능 완성 후 실제 할인 정책 적용 예정

        CouponEntity coupon = null;
        Long discountAmount = 0L;

        /*
        if (dto.getCouponId() != null) {

            coupon = couponRepository.findById(dto.getCouponId())
                    .orElseThrow(() ->
                            new EntityNotFoundException(
                                    "COUPON NOT FOUND"
                            )
                    );

            discountAmount = 10000L;

            if (discountAmount > originalPrice) {
                discountAmount = originalPrice;
            }
        }
        */

        // 최종 금액
        Long totalPrice =
                originalPrice - discountAmount;

        // 예약 생성
        ReservationEntity reservation =
                dto.toEntity(
                        memberEntity,
                        coupon,
                        stay,
                        office,
                        originalPrice,
                        discountAmount,
                        totalPrice
                );

        reservationRepository.save(reservation);

        // 첨부파일 저장
        if (files != null && !files.isEmpty()) {

            for (MultipartFile file : files) {

                if (file.isEmpty()) {
                    continue;
                }

                String originalFileName =
                        file.getOriginalFilename();

                // TODO
                // 실제 S3 업로드 처리 필요

                String s3Key =
                        "reservation/" + UUID.randomUUID();

                ReserveFileEntity reserveFile =
                        ReserveFileEntity.builder()
                                .reservationEntity(reservation)
                                .originalFileName(originalFileName)
                                .s3Key(s3Key)
                                .build();

                reserveFileRepository.save(reserveFile);

                log.info(
                        "예약 첨부파일 저장 완료 : {}",
                        originalFileName
                );
            }
        }

        return reservation.getId();
    }

    public Page<ReservationResDto> getList(
            String username,
            int pno
    ) {

        MemberEntity memberEntity = memberRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "MEMBER NOT FOUND"
                        )
                );

        Pageable pageable =
                PageRequest.of(pno, 10);

        return reservationRepository
                .findByMember(memberEntity, pageable)
                .map(ReservationResDto::from);
    }

    public ReservationResDto getOne(
            Long id,
            String username
    ) {

        MemberEntity memberEntity = memberRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "MEMBER NOT FOUND"
                        )
                );

        ReservationEntity entity =
                reservationRepository
                        .findByIdAndMember(
                                id,
                                memberEntity
                        )
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "RESERVATION NOT FOUND"
                                )
                        );

        return ReservationResDto.from(entity);
    }

    @Transactional
    public void update(
            Long id,
            ReservationCreateReqDto reqDto,
            String username
    ) {

        MemberEntity memberEntity = memberRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "MEMBER NOT FOUND"
                        )
                );

        ReservationEntity entity =
                reservationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "RESERVATION NOT FOUND"
                                )
                        );

        // 작성자 검증
        if (!entity.getMember().getId()
                .equals(memberEntity.getId())) {

            throw new AccessDeniedException(
                    "예약 수정 권한이 없습니다."
            );
        }

        // 엔티티 수정
        entity.update(reqDto);
    }
}