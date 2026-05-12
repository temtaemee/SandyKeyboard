package com.kh.app.middle.apply.service;

import com.kh.app.middle.apply.repository.SpaceApplyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SpaceApplyService {

    private final SpaceApplyRepository spaceApplyRepository;
}
