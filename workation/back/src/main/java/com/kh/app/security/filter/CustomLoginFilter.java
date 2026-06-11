package com.kh.app.security.filter;

import com.kh.app.security.exception.WithdrawnUserException;
import com.kh.app.security.user.CustomUserDetails;
import com.kh.app.security.user.UserVo;
import com.kh.app.security.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

@RequiredArgsConstructor
public class CustomLoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        Authentication token = null;
        try {
            UserVo vo = objectMapper.readValue(request.getInputStream(), UserVo.class);
            token = new UsernamePasswordAuthenticationToken(vo.getUsername(),  vo.getPassword());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return authenticationManager.authenticate( token );
    }

    @Override
    protected void successfulAuthentication(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain,
            Authentication authResult
    ) throws IOException, ServletException {

        System.out.println("login ok ~~~~~~~~~~");

        CustomUserDetails userDetails =
                (CustomUserDetails) authResult.getPrincipal();

        UserVo vo = userDetails.getUserVo();

        String jwt = jwtUtil.createJwt(
                vo.getId(),
                vo.getUsername(),
                vo.getRoles()
        );

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");

        response.setHeader("Authorization", "Bearer " + jwt);
        response.getWriter().write("""
        {
            "result": "success",
            "token": "%s"
        }
    """.formatted(jwt));
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String message = failed.getMessage();;

        response.getWriter().write("""
            {
                "result": "fail",
                "message": "%s"
            }
            """.formatted(message));
    }
}
