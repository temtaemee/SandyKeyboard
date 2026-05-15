package com.kh.app.transaction.reservation.service;

import com.kh.app.aws.service.S3Service;
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

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReserveFileRepository reserveFileRepository;
    private final MemberRepository memberRepository;
    private final S3Service s3Service;

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
    public Long create (
            String username,
            ProductType productType,
            Long productId,
            ReservationCreateReqDto dto,
            List<MultipartFile> fileList
    )throws IOException {

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




        // 파일 업로드
        if (fileList != null && !fileList.isEmpty()) {

            for (MultipartFile file : fileList) {

                log.info(
                        "[예약 첨부파일 업로드 시작] 파일명 : {}",
                        file.getOriginalFilename()
                );

                String s3Key =
                        s3Service.upload(file, "reservation");

                reserveFileRepository.save(
                        ReserveFileEntity.from(
                                reservation,
                                file,
                                s3Key
                        )
                );

                log.info(
                        "[예약 첨부파일 업로드 완료] s3Key : {}",
                        s3Key
                );
            }
        }

        return reservation.getId();
    }
    /// ///////////////////////////////////////////////////////////////////////////////////////

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
                .findByMemberOrderByIdDesc(memberEntity, pageable)
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