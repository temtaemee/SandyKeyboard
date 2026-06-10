package com.kh.app.security.config;

import com.kh.app.security.filter.CustomLoginFilter;
import com.kh.app.security.filter.JwtFilter;
import com.kh.app.security.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityFilterChainConfig {
    private final AuthenticationConfiguration configuration;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;
    @Bean
    public AuthenticationManager authenticationManager(){
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity hs, AuthenticationManager authenticationManager){
        //불필요한 설정 끄기
        hs.csrf(AbstractHttpConfigurer::disable);
        hs.formLogin(AbstractHttpConfigurer::disable);
        hs.httpBasic(AbstractHttpConfigurer::disable);
        hs.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        //URL 맵핑
        hs.authorizeHttpRequests(
                auth ->
                        auth
                                .requestMatchers("/api/guest/**").anonymous()
                                .requestMatchers("/api/public/**").permitAll()
                                .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
                                .requestMatchers("/api/seller/**").hasAnyAuthority("SELLER", "ADMIN")
                                .requestMatchers("/api/user/**").hasAnyAuthority("SELLER", "USER")
                                .requestMatchers("/api/auth/**").authenticated()
                                .requestMatchers(
                                        "/swagger-ui/**",
                                        "/v3/api-docs/**",
                                        "/swagger-ui.html",
                                        "/ws-connect/**"
                                ).permitAll()
                                .anyRequest().authenticated()
        );

        //JWT 필터 설정
        JwtFilter jwtFilter = new JwtFilter(jwtUtil);
        hs.addFilterBefore(jwtFilter , UsernamePasswordAuthenticationFilter.class);

        //로그인 필터 설정
        CustomLoginFilter customLoginFilter = new CustomLoginFilter(authenticationManager, jwtUtil , objectMapper);
        customLoginFilter.setFilterProcessesUrl("/api/guest/login");
        hs.addFilterAt( customLoginFilter , UsernamePasswordAuthenticationFilter.class);
        hs.cors(
                corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {
                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                        CorsConfiguration conf = new CorsConfiguration();

                        conf.addAllowedOrigin("http://localhost:5173");
                        conf.addAllowedOrigin("http://127.0.0.1:5173");
                        conf.addAllowedOrigin("https://sandykey.shop");
                        conf.addAllowedHeader("*");
                        conf.addAllowedMethod("*");
                        conf.setAllowCredentials(true);
                        conf.addExposedHeader("*");
                        conf.addExposedHeader("Authorization");

                        return conf;
                    }
                })
        );


        return hs.build();
    }
}
