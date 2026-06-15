package com.kh.app.config;

import com.kh.app.security.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;
import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtUtil jwtUtil;

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

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    authenticate(accessor);
                }

                if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                    authorizeNotificationSubscription(accessor);
                }

                return message;
            }
        });
    }

    private void authenticate(StompHeaderAccessor accessor) {
        String authorization = firstNativeHeader(accessor, "Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new MessagingException("WebSocket Authorization header is required.");
        }

        String token = authorization.substring(7);
        if (jwtUtil.isExpired(token)) {
            throw new MessagingException("WebSocket token is expired.");
        }

        Long memberId = jwtUtil.getMemberId(token);
        accessor.setUser(new StompMemberPrincipal(memberId));
        if (accessor.getSessionAttributes() != null) {
            accessor.getSessionAttributes().put("memberId", memberId);
        }
    }

    private void authorizeNotificationSubscription(StompHeaderAccessor accessor) {
        String destination = accessor.getDestination();
        if (destination == null || !destination.startsWith("/topic/notifications/")) {
            return;
        }

        Principal user = accessor.getUser();
        Object sessionMemberId = accessor.getSessionAttributes() == null
                ? null
                : accessor.getSessionAttributes().get("memberId");
        String memberId = destination.substring("/topic/notifications/".length());
        boolean principalMatches = user != null && user.getName().equals(memberId);
        boolean sessionMatches = sessionMemberId != null && String.valueOf(sessionMemberId).equals(memberId);

        if (!principalMatches && !sessionMatches) {
            throw new MessagingException("Cannot subscribe to another member's notification topic.");
        }
    }

    private String firstNativeHeader(StompHeaderAccessor accessor, String name) {
        List<String> values = accessor.getNativeHeader(name);
        return values == null || values.isEmpty() ? null : values.get(0);
    }

    private record StompMemberPrincipal(Long memberId) implements Principal {
        @Override
        public String getName() {
            return String.valueOf(memberId);
        }
    }
}
