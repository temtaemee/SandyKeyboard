package com.kh.app.transaction.reservation.controller;

import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
import com.kh.app.transaction.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
@Slf4j
public class ResA {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Long> create(
            @RequestPart("dto") ReservationCreateReqDto dto,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        Long reservationId = reservationService.create(dto, files);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reservationId);
    }


}