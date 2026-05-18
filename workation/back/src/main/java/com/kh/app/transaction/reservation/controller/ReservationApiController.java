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
          //stay랑 office 완성후 사용
//  @PostMapping("/user/{productType}/{productId}/reservation")
    @PostMapping("/user/reservation")
    public ResponseEntity<Long> create(
            //stay랑 office 완성후 사용
//            @PathVariable ProductType productType,
//            @PathVariable Long productId,
            @AuthenticationPrincipal(expression = "username") String username,
            @RequestPart(name = "data") ReservationCreateReqDto dto,
            @RequestPart(name = "fileList", required = false) List<MultipartFile> fileList
    ) throws IOException {

        log.info("dto = {}", dto.getCheckinDate());

        Long reservationId = reservationService.create(
                username,
//                productType,
//                productId,
                dto,
                fileList
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reservationId);
    }


    @GetMapping("/user/reservation")
    public ResponseEntity<?> getReservations(@RequestParam(defaultValue = "0") int pno,@AuthenticationPrincipal(expression = "username") String username) {


        Page<ReservationResDto> dtoList = reservationService.getList(username, pno);

        return ResponseEntity.ok(dtoList);

    }

    @GetMapping("/user/reservation/{id}")
    public ResponseEntity<ReservationResDto> getOne(@PathVariable Long id,@AuthenticationPrincipal(expression = "username") String username) {

        ReservationResDto resDto = reservationService.getOne(id, username);
        return ResponseEntity.ok(resDto);
    }

    @PutMapping("/user/reservation/{id}")
    public ResponseEntity<Object> update(@PathVariable Long id, @RequestBody ReservationCreateReqDto dto,@AuthenticationPrincipal(expression = "username") String username)
    {

        reservationService.update(id ,dto ,username);
        return ResponseEntity.ok().build();
    }



}