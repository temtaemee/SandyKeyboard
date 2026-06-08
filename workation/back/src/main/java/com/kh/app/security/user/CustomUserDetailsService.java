package com.kh.app.security.user;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.Role;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.product.space.entity.Area;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        MemberEntity entity = memberRepository
                .findByUsername(username)
                .orElseThrow(()-> new UsernameNotFoundException("회원 없음"));
        if (entity.getDeletedAt() != null) {
            throw new UsernameNotFoundException("탈퇴 처리된 계정입니다.");
        }
        Area preferredArea = (entity.getProfile() != null) ? entity.getProfile().getPreferredArea()
                : null;

        List<String> roles = entity.getRoleSet()
                .stream()
                .map(Role::name)
                .toList();

        UserVo userVo = UserVo.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .password(entity.getPassword())
                .deletedAt(entity.getDeletedAt())
                .roles(roles) // 임시
                .banYn(entity.getBanYn())
                .preferredArea(preferredArea)
                .build();

        return new CustomUserDetails(userVo);
    }


}
