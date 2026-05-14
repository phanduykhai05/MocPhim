package mocphim.com.backend_web.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.url}")
    private String appUrl;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        String link = appUrl + "/auth/verify-email?token=" + token;
        sendHtmlEmail(toEmail, "Xác thực tài khoản MocPhim", buildVerificationHtml(link));
    }

    @Async
    public void sendResetPasswordEmail(String toEmail, String token) {
        String link = frontendUrl + "/reset-password?token=" + token;
        sendHtmlEmail(toEmail, "Đặt lại mật khẩu MocPhim", buildResetHtml(link));
    }

    private void sendHtmlEmail(String toEmail, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Email gửi thành công đến: {}", toEmail);
        } catch (Exception e) {
            log.error("Lỗi gửi email đến {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildVerificationHtml(String link) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0">
                <tr><td align="center">
                  <table width="600" cellpadding="0" cellspacing="0"
                         style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
                    <tr><td style="background:#e50914;padding:30px;text-align:center">
                      <h1 style="color:#fff;margin:0;font-size:28px;letter-spacing:1px">MocPhim</h1>
                    </td></tr>
                    <tr><td style="padding:40px">
                      <h2 style="color:#222;margin-top:0">Xác thực tài khoản</h2>
                      <p style="color:#555;line-height:1.7">Chào bạn,</p>
                      <p style="color:#555;line-height:1.7">
                        Cảm ơn bạn đã đăng ký tài khoản tại <strong>MocPhim</strong>.
                        Nhấn vào nút bên dưới để xác thực email và kích hoạt tài khoản.
                      </p>
                      <p style="color:#555;line-height:1.7">
                        Link xác thực có hiệu lực trong <strong>24 giờ</strong>.
                      </p>
                      <div style="text-align:center;margin:35px 0">
                        <a href="%s"
                           style="background:#e50914;color:#fff;padding:14px 36px;border-radius:4px;
                                  text-decoration:none;font-size:16px;font-weight:bold;display:inline-block">
                          Xác thực tài khoản
                        </a>
                      </div>
                      <p style="color:#999;font-size:13px;word-break:break-all">
                        Hoặc copy link sau vào trình duyệt:<br>
                        <a href="%s" style="color:#e50914">%s</a>
                      </p>
                    </td></tr>
                    <tr><td style="background:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
                      <p style="color:#aaa;font-size:12px;margin:0">
                        Nếu bạn không đăng ký tài khoản này, hãy bỏ qua email này.
                      </p>
                    </td></tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(link, link, link);
    }

    private String buildResetHtml(String link) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0">
                <tr><td align="center">
                  <table width="600" cellpadding="0" cellspacing="0"
                         style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
                    <tr><td style="background:#e50914;padding:30px;text-align:center">
                      <h1 style="color:#fff;margin:0;font-size:28px;letter-spacing:1px">MocPhim</h1>
                    </td></tr>
                    <tr><td style="padding:40px">
                      <h2 style="color:#222;margin-top:0">Đặt lại mật khẩu</h2>
                      <p style="color:#555;line-height:1.7">Chào bạn,</p>
                      <p style="color:#555;line-height:1.7">
                        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>MocPhim</strong> của bạn.
                        Nhấn vào nút bên dưới để tiếp tục.
                      </p>
                      <p style="color:#555;line-height:1.7">
                        Link có hiệu lực trong <strong>15 phút</strong>.
                      </p>
                      <div style="text-align:center;margin:35px 0">
                        <a href="%s"
                           style="background:#e50914;color:#fff;padding:14px 36px;border-radius:4px;
                                  text-decoration:none;font-size:16px;font-weight:bold;display:inline-block">
                          Đặt lại mật khẩu
                        </a>
                      </div>
                      <p style="color:#999;font-size:13px;word-break:break-all">
                        Hoặc copy link sau vào trình duyệt:<br>
                        <a href="%s" style="color:#e50914">%s</a>
                      </p>
                    </td></tr>
                    <tr><td style="background:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
                      <p style="color:#aaa;font-size:12px;margin:0">
                        Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
                        Mật khẩu của bạn sẽ không thay đổi.
                      </p>
                    </td></tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(link, link, link);
    }
}
