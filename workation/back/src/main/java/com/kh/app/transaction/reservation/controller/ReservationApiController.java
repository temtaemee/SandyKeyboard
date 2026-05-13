package com.kh.app.transaction.reservation.controller;

import com.kh.app.security.user.CustomUserDetails;
import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
import com.kh.app.transaction.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/user/reservation")
@RequiredArgsConstructor
@Slf4j
public class ReservationApiController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Long> create(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @ModelAttribute("dto") ReservationCreateReqDto dto,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) {
        Long reservationId = reservationService.create(userDetails,dto, files);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reservationId);
    }


}