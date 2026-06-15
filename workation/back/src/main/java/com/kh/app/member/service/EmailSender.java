package com.kh.app.member.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class EmailSender {

    private final JavaMailSender mailSender;

    @Async // 💡 별도의 클래스에서 호출되어야 프록시가 작동하여 진짜 비동기로 돕니다!
    public void sendEmailAsync(String email, String code, String typeLabel) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            // 💡 typeLabel에 따라 "소셜연동" 또는 "비밀번호 재설정"이 동적으로 박힙니다.
            helper.setSubject("[모래묻은키보드] " + typeLabel + " 인증코드");

            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;'>"
                    + "<h2>[모래묻은키보드] " + typeLabel + "</h2>"
                    + "<p>안녕하세요. 요청하신 " + typeLabel + " 인증코드입니다.</p>"
                    + "<div style='background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: #4A90E2; letter-spacing: 5px;'>"
                    +     code
                    + "</div>"
                    + "<p style='color: #888; font-size: 12px; margin-top: 20px;'>본 인증코드는 " + typeLabel + " 페이지에서만 사용 가능합니다.</p>"
                    + "</div>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("비동기 메일 발송 성공 ({}) : {}", typeLabel, email);

        } catch (Exception e) {
            log.error("비동기 메일 발송 중 에러 발생 ({}) : {}", typeLabel, email, e);
        }
    }
}
