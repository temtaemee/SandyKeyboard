package com.kh.app.security.user;

import lombok.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVo {

    private Long id;

    private String username;

    private String password;

    private List<String> roles;

    private String banYn;
}