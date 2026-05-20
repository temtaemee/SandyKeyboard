package com.kh.app.transaction.reservation.controller;

import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
import com.kh.app.transaction.reservation.dto.request.ReservationUpdateReqDto;
import com.kh.app.transaction.reservation.dto.response.ReservationResDto;
import com.kh.app.transaction.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class ReservationApiController {

    private final ReservationService reservationService;
          //stay 완성후 사용
//  @PostMapping("/user/reservation/{stayId}")
  @PostMapping("/user/reservation")
    public ResponseEntity<Long> create(
          //stay 완성후 사용
//            @PathVariable Long stayId,
            @AuthenticationPrincipal(expression = "username") String username,
            @RequestPart(name = "data") ReservationCreateReqDto dto,
            @RequestPart(name = "fileList", required = false) List<MultipartFile> fileList
    ) throws IOException {

        log.info("dto = {}", dto.getCheckinDate());

        Long reservationId = reservationService.create(
                username,
                //stay 완성후 사용
//                stayId,
                dto,
                fileList
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reservationId);
    }

    @GetMapping("/user/reservation")
    public ResponseEntity<List<ReservationResDto>> getMyReservations(
            @AuthenticationPrincipal(expression = "username") String username
    ) {

        return ResponseEntity.ok(
                reservationService.getMyReservations(username)
        );
    }

    @GetMapping("/user/reservation/{id}")
    public ResponseEntity<ReservationResDto> getOne(@PathVariable Long id) {


        return ResponseEntity.ok(
                reservationService.getOne(id)
        );
    }



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





}