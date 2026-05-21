package com.kh.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 프론트엔드에서 웹소켓 연결을 시도할 엔드포인트 주소입니다. (예: ws://localhost:8080/ws-connect)
        registry.addEndpoint("/ws-connect")
                .setAllowedOriginPatterns("*"); // CORS 에러 방지 (프로덕션 환경에서는 리액트 주소만 넣는 것을 권장해요)
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 1. 서버가 클라이언트에게 메시지를 보낼 때 사용하는 경로 접두사 (구독)
        // 리액트에서는 /topic/notifications/{memberId} 형태로 구독하게 됩니다.
        registry.enableSimpleBroker("/topic");

        // 2. 클라이언트가 서버로 메시지를 보낼 때 사용하는 경로 접두사 (이번 알림 기능에서는 거의 쓸 일 없습니다)
        registry.setApplicationDestinationPrefixes("/app");
    }
}