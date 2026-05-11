package com.kh.app.transaction.reservation.controller;

import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
import com.kh.app.transaction.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
public class ReservationApiController {

    private final ReservationService reservationService;

    @PostMapping
    public Long create(
            @RequestPart("dto") ReservationCreateReqDto dto,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        return reservationService.create(dto, files);
    }


}