package com.kh.app.security.filter;

import com.kh.app.member.entity.MemberEntity; // 💡 본인 엔티티 경로에 맞게 임포트
import com.kh.app.member.repository.MemberRepository; // 💡 본인 리포지토리 경로에 맞게 임포트
import com.kh.app.security.user.CustomUserDetails;
import com.kh.app.security.user.UserVo;
import com.kh.app.security.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository; // 💡 1. 밴 확인을 위해 DB 리포지토리 주입 추가

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();

        if (uri.startsWith("/api/guest/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            System.out.println("토큰 없음 ...");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorization.substring(7);

        if (jwtUtil.isExpired(token)) {
            System.out.println("토큰 만료 ...");
            filterChain.doFilter(request, response);
            return;
        }

        String username = jwtUtil.getUsername(token);
        List<String> roles = jwtUtil.getRoles(token);
        Long memberId = jwtUtil.getMemberId(token);

        // 💡 2. [핵심 추가] 토큰 정보가 유효하다면, 인증 객체를 만들기 전에 DB에서 유저의 활성화 상태 체크
        MemberEntity member = memberRepository.findByUsername(username).orElse(null);

        // 유저 상태가 'BANNED'거나 정지된 상태인지 확인 (엔티티의 필드명/상태값에 맞게 변경하세요)
        if (member != null && "Y".equalsIgnoreCase(member.getBanYn())) {
            sendBannedResponse(response);
            return;
        }

        UserVo vo = UserVo.builder()
                .id(memberId)
                .username(username)
                .roles(roles)
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(vo);

        Authentication authToken =
                new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }

    // 💡 3. 프론트엔드 Axios 인터셉터가 식별할 수 있는 커스텀 JSON 응답 생성 메서드
    private void sendBannedResponse(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403 Forbidden
        response.setContentType("application/json;charset=UTF-8");

        // 프론트엔드가 조건문으로 가려낼 'BANNED_USER' 메시지를 JSON 바디에 심어줌
        String json = "{\"message\": \"BANNED_USER\", \"detail\": \"관리자에 의해 이용이 정지된 계정입니다.\"}";

        response.getWriter().write(json);
    }
}