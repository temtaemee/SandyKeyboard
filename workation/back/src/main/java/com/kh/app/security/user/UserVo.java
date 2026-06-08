package com.kh.app.security.user;

import com.kh.app.product.space.entity.Area;
import lombok.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class UserVo {

    private Long id;

    private String username;

    private String password;

    private LocalDateTime deletedAt;

    private List<String> roles;

    private String banYn;
    // 🌟 추가: 선호 지역 정보
    private Area preferredArea;
}