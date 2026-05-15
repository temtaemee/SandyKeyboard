package com.kh.app.security.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final UserVo vo;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        if (vo.getRoles() == null || vo.getRoles().isEmpty()) {
            return List.of();
        }

        return vo.getRoles()
                .stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    @Override
    public @Nullable String getPassword() {
        return vo.getPassword();
    }

    @Override
    public String getUsername() {
        return vo.getUsername();
    }

    public UserVo getUserVo() {
        return vo;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !"Y".equals(vo.getBanYn());
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    public Long getMemberId() {
        return vo.getId();
    }
}