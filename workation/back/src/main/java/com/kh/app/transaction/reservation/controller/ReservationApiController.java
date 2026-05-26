package com.kh.app.transaction.reservation.controller;

import com.kh.app.middle.coupon.dto.response.MemberCouponRespDto;
import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
import com.kh.app.transaction.reservation.dto.request.ReservationUpdateReqDto;
import com.kh.app.transaction.reservation.dto.response.ReservationAdminListResDto;
import com.kh.app.transaction.reservation.dto.response.ReservationResDto;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.service.ReservationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class ReservationApiController {

    private final ReservationService reservationService;


    @PostMapping("/user/reservation/{stayId}")
    public ResponseEntity<Map<String, Object>> create(
            @PathVariable Long stayId,
            @RequestPart(name = "data") ReservationCreateReqDto dto, // 💡 프론트 폼데이터 네임 매칭
            @RequestPart(value = "fileList", required = false) List<MultipartFile> fileList,
            @AuthenticationPrincipal(expression = "username") String username
    ) throws IOException {

        log.info("예약 및 실시간 가격 정산 요청 - 숙소 ID: {}", stayId);

        // 💡 서비스가 예약 데이터 저장 및 실시간 방값 연산을 끝내고 Map으로 결과를 리턴합니다.
        Map<String, Object> result = reservationService.create(username, stayId, dto, fileList);

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }




    //결제 완료후 보기
    @GetMapping("/user/reservation")
    public ResponseEntity<List<ReservationResDto>> getMyReservations(
            @AuthenticationPrincipal(expression = "username") String username
    ) {

        return ResponseEntity.ok(
                reservationService.getMyReservations(username)
        );
    }

    //결제 완료후 보기
    @GetMapping("/user/reservation/{id}")
    public ResponseEntity<ReservationResDto> getOne(@PathVariable Long id) {


        return ResponseEntity.ok(
                reservationService.getOne(id)
        );
    }



    //결제 완료후 보기
    @PutMapping("/user/reservation/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @RequestPart("data") ReservationUpdateReqDto dto,
            @RequestPart(value = "fileList", required = false) List<MultipartFile> fileList,
            @AuthenticationPrincipal(expression = "username") String username
    ) throws IOException {

        reservationService.update(id, dto, fileList);

        return ResponseEntity.ok().build();
    }

    //관리자 검색
    @GetMapping("/admin/reservation/list")
    public ResponseEntity<Page<ReservationAdminListResDto>> getAdminReservationList(
            @RequestParam(defaultValue = "0") int pno
    ) {
        Page<ReservationAdminListResDto> reservationPage = reservationService.getAdminReservationList(pno);
        return ResponseEntity.ok(reservationPage);
    }





}