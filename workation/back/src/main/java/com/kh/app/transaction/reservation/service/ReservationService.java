package com.kh.app.transaction.reservation.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.security.user.CustomUserDetails;
import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
import com.kh.app.transaction.reservation.dto.response.ReservationResDto;
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

    @Transactional
    public Long create(
            String username,
            ReservationCreateReqDto dto,
            List<MultipartFile> files
    ) {
        MemberEntity memberEntity = memberRepository
                .findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND ........"));

        // 날짜 검증
        if (dto.getCheckinDate().isAfter(dto.getCheckoutDate())) {
            throw new IllegalArgumentException(
                    "체크인 날짜가 체크아웃보다 늦을 수 없습니다."
            );
        }

        // TODO
        // 실제 숙소/오피스 조회 후 가격 계산

        Long originalPrice = 100000L;

        // TODO
        // 쿠폰 할인 계산

        Long discountAmount = 0L;

        Long totalPrice =
                originalPrice - discountAmount;

        // 예약 생성
        ReservationEntity reservation =
                dto.toEntity(
                        memberEntity,
                        null,
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
                // 실제 S3 업로드

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

        Pageable pageable = PageRequest.of(pno, 10);

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