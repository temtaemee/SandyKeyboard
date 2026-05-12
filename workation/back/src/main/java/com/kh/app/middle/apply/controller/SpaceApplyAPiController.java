package com.kh.app.middle.apply.controller;

import com.kh.app.middle.apply.service.SpaceApplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@RequestMapping("/api")
@RequiredArgsConstructor
public class SpaceApplyAPiController {

    private final SpaceApplyService spaceApplyService;


}
