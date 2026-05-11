package com.kh.app.security.user;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.Role;
import com.kh.app.member.repository.MemberRepository;
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

        List<String> roles = entity.getRoleSet()
                .stream()
                .map(Role::name)
                .toList();

        UserVo userVo = UserVo.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .password(entity.getPassword())
                .roles(roles) // 임시
                .banYn(entity.getBanYn())
                .build();

        return new CustomUserDetails(userVo);
    }


}
