package com.kh.app.product.stay.controller;

import com.kh.app.product.space.entity.Area;
import com.kh.app.product.stay.dto.request.StayInsertReqDto;
import com.kh.app.product.stay.dto.request.StaySearchReqDto;
import com.kh.app.product.stay.dto.request.StayUpdateReqDto;
import com.kh.app.product.stay.dto.response.StayResDto;
import com.kh.app.product.stay.entity.StayOption;
import com.kh.app.product.stay.service.StayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Stay", description = "숙소 관리 API")
@RestController
@Slf4j
@RequiredArgsConstructor
public class StayApiController {

    private final StayService stayService;

    @Operation(summary = "숙소 전체 조회", description = "keyword/spaceId/workationYn/area/minPrice/maxPrice/capacity/options 동적 필터 지원")
    @GetMapping("/api/public/stay")
    public ResponseEntity<List<StayResDto>> searchList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long spaceId,
            @RequestParam(required = false) String workationYn,
            @RequestParam(required = false) Area area,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) List<StayOption> options
    ) {
        StaySearchReqDto dto = new StaySearchReqDto();
        dto.setKeyword(keyword);
        dto.setSpaceId(spaceId);
        dto.setWorkationYn(workationYn);
        dto.setArea(area);
        dto.setMinPrice(minPrice);
        dto.setMaxPrice(maxPrice);
        dto.setCapacity(capacity);
        dto.setOptions(options);
        return ResponseEntity.ok(stayService.searchList(dto));
    }

    @Operation(summary = "숙소 상세 조회")
    @GetMapping("/api/public/stay/{id}")
    public ResponseEntity<StayResDto> selectOne(@PathVariable Long id) {
        return ResponseEntity.ok(stayService.selectOne(id));
    }

    @Operation(summary = "숙소 등록", description = "multipart/form-data: dto(JSON) + files(이미지, 선택)")
    @PostMapping(value = "/api/seller/stay", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> insert(
            @Valid @RequestPart("dto") StayInsertReqDto dto,
            @RequestPart(name = "files", required = false) List<MultipartFile> files
    ) {
        return ResponseEntity.ok(stayService.insert(dto, files));
    }

    @Operation(summary = "숙소 수정")
    @PutMapping("/api/seller/stay/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @Valid @RequestBody StayUpdateReqDto dto
    ) {
        stayService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "숙소 노출 여부 변경")
    @PutMapping("/api/seller/stay/{id}/visible")
    public ResponseEntity<Void> changeVisibleYn(
            @PathVariable Long id,
            @RequestParam String visibleYn
    ) {
        stayService.changeVisibleYn(id, visibleYn);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "숙소 삭제 (soft)")
    @DeleteMapping("/api/seller/stay/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        stayService.delete(id);
        return ResponseEntity.ok().build();
    }
}
