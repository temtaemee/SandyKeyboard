package com.kh.app.transaction.reservation.controller;

import com.kh.app.middle.coupon.dto.response.MemberCouponRespDto;
import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
import com.kh.app.transaction.reservation.dto.request.ReservationUpdateReqDto;
import com.kh.app.transaction.reservation.dto.response.ReservationAdminListResDto;
import com.kh.app.transaction.reservation.dto.response.ReservationDetailResDto;
import com.kh.app.transaction.reservation.dto.response.ReservationResDto;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import com.kh.app.transaction.reservation.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
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

    //예약 완료된 날짜 조회
    @GetMapping("/user/reservation/booked-dates/{stayId}")
    @Operation(summary = "숙소별 예약 완료된 날짜 조회", description = "달력에 예약 불가 처리(disabled)를 하기 위해 기예약된 날짜 범위를 리턴합니다.")
    public ResponseEntity<List<Map<String, String>>> getBookedDates(@PathVariable Long stayId) {
        return ResponseEntity.ok(reservationService.getBookedDates(stayId));
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
    // 일반 유저 예약 완료 후 상세보기 (통합 패키지 버전)
    @GetMapping("/user/reservation/{id}")
    public ResponseEntity<ReservationDetailResDto> getOne(@PathVariable Long id) {
        log.info("유저 예약 통합 상세 페이지 요청 - 예약 ID: {}", id);

        return ResponseEntity.ok(
                reservationService.getReservationDetail(id)
        );
    }



    //결제 완료후 보기
    @PutMapping("/user/reservation/{id}")
    @Operation(summary = "유저 예약 정보 수정 (파일 수정 불가)", description = "결제 완료(PAYMENT_COMPLETED) 상태에서만 예약자 연락처 정보(3개 필드) 변경이 가능합니다.")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @RequestBody ReservationUpdateReqDto dto, // 💡 @RequestPart 대신 @RequestBody 사용
            @AuthenticationPrincipal(expression = "username") String username
    ) {
        log.info("유저 예약 정보 수정 요청 (텍스트 전용) - 예약 ID: {}, 요청자: {}", id, username);

        // 서비스 단에 id와 dto만 전송
        reservationService.update(id, dto);

        return ResponseEntity.ok().build();
    }

    //관리자 검색
    @GetMapping("/admin/reservation/list")
    public ResponseEntity<Page<ReservationAdminListResDto>> getAdminReservationList(
            @RequestParam(defaultValue = "0") int pno,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String guestName,
            @RequestParam(required = false) Long reservationId,
            @RequestParam(required = false) String sellerUsername
    ) {
        Page<ReservationAdminListResDto> reservationPage =
                reservationService.getAdminReservationList(pno, username, guestName, reservationId, sellerUsername);
        return ResponseEntity.ok(reservationPage);
    }

    @Operation(summary = "관리자 예약 단건 상세 조회", description = "관리자가 특정 예약의 상세 내역을 조회합니다. (첨부파일 및 숙소 정보 포함)")
    @GetMapping("/admin/reservation/{id}")
    public ResponseEntity<ReservationDetailResDto> getAdminOne(@PathVariable Long id) {
        log.info("관리자 예약 상세 페이지 요청 - 예약 ID: {}", id);

        ReservationDetailResDto adminDetail = reservationService.getAdminReservationDetail(id);
        return ResponseEntity.ok(adminDetail);
    }


    // 판매자 전용 예약 목록 및 동적 조건 검색 조회
    @Operation(summary = "판매자 보유 숙소 예약 목록 검색 조회", description = "...")
    @GetMapping("/seller/reservation/list")
    public ResponseEntity<Page<ReservationAdminListResDto>> getSellerReservationList(
            @RequestParam(defaultValue = "0") int pno,
            @AuthenticationPrincipal(expression = "username") String sellerUsername,
            @RequestParam(required = false) Long reservationId,
            @RequestParam(required = false) String guestName,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkinDate,
            @RequestParam(required = false) ReservationStatus status // 💡 추가
    ) {
        Page<ReservationAdminListResDto> reservationPage =
                reservationService.getSellerReservationList(pno, sellerUsername, reservationId, guestName, checkinDate, status);

        return ResponseEntity.ok(reservationPage);
    }

    // 판매자 전용 예약 단건 상세 조회
    @Operation(summary = "판매자 예약 단건 상세 조회", description = "판매자가 본인 숙소에 들어온 특정 예약의 상세 내역을 조회합니다. (소유권 검증 및 첨부파일 포함)")
    @GetMapping("/seller/reservation/detail/{id}")
    public ResponseEntity<ReservationDetailResDto> getSellerOne(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "username") String sellerUsername
    ) {
        log.info("판매자 예약 상세 조회 요청 - 판매자: {}, 예약 ID: {}", sellerUsername, id);

        ReservationDetailResDto sellerDetail = reservationService.getSellerReservationDetail(id, sellerUsername);
        return ResponseEntity.ok(sellerDetail);
    }




}