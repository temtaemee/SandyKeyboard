package com.kh.app.transaction.reservation.controller;

import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
import com.kh.app.transaction.reservation.dto.response.ReservationResDto;
import com.kh.app.transaction.reservation.entity.ProductType;
import com.kh.app.transaction.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class ReservationApiController {

    private final ReservationService reservationService;

    @PostMapping("/{productType}/{productId}/reservation")
    public ResponseEntity<Long> create(
            @PathVariable ProductType productType,
            @PathVariable Long productId,
            @AuthenticationPrincipal String username,
            @RequestPart ReservationCreateReqDto dto,
            @RequestPart(value = "files", required = false)
            List<MultipartFile> files
    ) {



        Long reservationId = reservationService.create(
                username,
                productType,
                productId,
                dto,
                files
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reservationId);
    }


    @GetMapping("/user/reservation")
    public ResponseEntity<?> getReservations(@RequestParam(defaultValue = "0") int pno) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Page<ReservationResDto> dtoList = reservationService.getList(username, pno);

        return ResponseEntity.ok(dtoList);

    }

    @GetMapping("/user/reservation/{id}")
    public ResponseEntity<ReservationResDto> getOne(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        ReservationResDto resDto = reservationService.getOne(id, username);
        return ResponseEntity.ok(resDto);
    }

    @PutMapping("/user/reservation/{id}")
    public ResponseEntity<Object> update(@PathVariable Long id, @RequestBody ReservationCreateReqDto dto)
    {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        reservationService.update(id ,dto ,username);
        return ResponseEntity.ok().build();
    }


}