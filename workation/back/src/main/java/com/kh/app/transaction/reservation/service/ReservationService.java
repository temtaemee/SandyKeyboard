package com.kh.app.transaction.reservation.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReserveFileEntity;
import com.kh.app.transaction.reservation.repository.ReservationRepository;
import com.kh.app.transaction.reservation.repository.ReserveFileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    // coupon 기능 완성 후 추가 예정
    // private final CouponRepository couponRepository;

    @Transactional
    public Long create(
            String username,
            Long stayId,
            ReservationCreateReqDto dto,
            List<MultipartFile> fileList
    ) throws IOException {

        // 회원 조회
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
        // stay 기능 완성 후 실제 DB 조회 및 존재 검증 필요
        StayEntity stay = StayEntity.builder()
                .id(stayId)
                .build();

        log.info(
                "[임시 예약 생성] stayId={}",
                stayId
        );
        log.info(
                "[임시 예약 생성] stayId={}",
                stayId
        );

        // TODO
        // 실제 숙소 가격 정책 연결 예정
        Long originalPrice = 100000L;

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

            // 임시 할인 금액
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
}