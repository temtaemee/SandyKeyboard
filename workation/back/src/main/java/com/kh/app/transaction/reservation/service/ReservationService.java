package com.kh.app.transaction.reservation.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
import com.kh.app.transaction.reservation.dto.response.ReservationResDto;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReserveFileEntity;
import com.kh.app.transaction.reservation.repository.ReservationRepository;
import com.kh.app.transaction.reservation.repository.ReserveFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final MemberRepository memberRepository;
    private final ReserveFileRepository reserveFileRepository;

    public Long create(ReservationCreateReqDto dto, List<MultipartFile> files) {

        MemberEntity member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("member not found"));

        ReservationEntity reservation = ReservationEntity.builder()
                .member(member)
                .couponId(dto.getCouponId())
                .stayId(dto.getStayId())
                .officeId(dto.getOfficeId())
                .guestCount(dto.getGuestCount())
                .reserverName(dto.getReserverName())
                .checkinDate(dto.getCheckinDate())
                .checkoutDate(dto.getCheckoutDate())
                .reserverPhone(dto.getReserverPhone())
                .reserverEmail(dto.getReserverEmail())
                .originalPrice(dto.getOriginalPrice())
                .discountAmount(dto.getDiscountAmount() == null ? 0L : dto.getDiscountAmount())
                .totalPrice(dto.getTotalPrice())
                .status("PENDING")
                .build();

        reservationRepository.save(reservation);

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {

                ReserveFileEntity reserveFile = ReserveFileEntity.builder()
                        .reservationEntity(reservation)
                        .originalFileName(file.getOriginalFilename())
                        .s3Key(file.getOriginalFilename())
                        .build();

                reserveFileRepository.save(reserveFile);
            }
        }

        return reservation.getId();
    }


}