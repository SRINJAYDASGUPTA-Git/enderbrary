package com.srinjaydg.enderbrary.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value ("${application.frontend.url}")
    private String frontendUrl;

    @Async
    public void sendActivationMail(
            String to,
            String userName,
            EmailTemplatename emailTemplate,
            String confirmationUrl,
            String activationCode,
            String subject
    ) throws MessagingException {
        String templateName = (emailTemplate == null) ? "activate_account" : emailTemplate.getName();

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                UTF_8.name()
        );

        // Email variables
        Map<String, Object> properties = new HashMap<>();
        properties.put("userName", userName);
        properties.put("confirmationUrl", confirmationUrl);
        properties.put("activation_code", activationCode);
        Context context = new Context();
        context.setVariables(properties);

        // Set basic email metadata
        helper.setFrom("contact@srinjaydg.in");
        helper.setTo(to);
        helper.setSubject(subject);

        // Render Thymeleaf template
        String htmlContent = templateEngine.process(templateName, context);
        helper.setText(htmlContent, true);

        // Embed the logo from resources/static/logo.png
        ClassPathResource logo = new ClassPathResource("static/logo.png");
        helper.addInline("logoImage", logo);

        // Send
        mailSender.send(mimeMessage);
    }

    @Async
    public void sendBorrowRequestMail(
            String to,
            String lenderName,
            String borrowerName,
            String bookTitle,
            EmailTemplatename emailTemplate,
            String manageRequestUrl
    ) throws MessagingException, UnsupportedEncodingException, UnsupportedEncodingException {

        log.info("Sending borrow request email to {}", to);

        String templateName = (emailTemplate == null) ? "borrow_request" : emailTemplate.getName();

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                UTF_8.name()
        );

        Map<String, Object> props = new HashMap<>();
        props.put("lenderName", lenderName);
        props.put("borrowerName", borrowerName);
        props.put("bookTitle", bookTitle);
        props.put("manageRequestUrl", manageRequestUrl);

        Context context = new Context();
        context.setVariables(props);

        helper.setFrom(new InternetAddress("info@enderbrary.srinjaydg.in", "Enderbrary"));
        helper.setTo(to);
        helper.setReplyTo("noreply@enderbrary.srinjaydg.in");
        helper.setSubject("New Borrow Request for " + bookTitle);

        String htmlContent = templateEngine.process(templateName, context);
        helper.setText(htmlContent, true);

        ClassPathResource logo = new ClassPathResource("static/logo.png");
        helper.addInline("logoImage", logo);

        mailSender.send(mimeMessage);
    }

    @Async
    public void sendBorrowApprovedEmail(
            String to,
            String borrowerName,
            String lenderName,
            String bookTitle,
            String viewUrl
    ) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, UTF_8.name());

        Map<String, Object> props = new HashMap<>();
        props.put("borrowerName", borrowerName);
        props.put("lenderName", lenderName);
        props.put("bookTitle", bookTitle);
        props.put("viewUrl", viewUrl);

        Context context = new Context();
        context.setVariables(props);

        helper.setFrom("info@enderbrary.srinjaydg.in");
        helper.setTo(to);
        helper.setSubject("Your borrow request for \"" + bookTitle + "\" has been approved");

        String htmlContent = templateEngine.process(EmailTemplatename.BORROW_REQUEST_APPROVED.getName(), context);
        helper.setText(htmlContent, true);
        helper.addInline("logoImage", new ClassPathResource("static/logo.png"));

        mailSender.send(mimeMessage);
    }

    @Async
    public void sendBorrowRejectedEmail(
            String to,
            String borrowerName,
            String lenderName,
            String bookTitle
    ) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, UTF_8.name());

        Map<String, Object> props = new HashMap<>();
        props.put("borrowerName", borrowerName);
        props.put("lenderName", lenderName);
        props.put("bookTitle", bookTitle);
        props.put ("bookExploreUrl", frontendUrl);

        Context context = new Context();
        context.setVariables(props);

        helper.setFrom("info@enderbrary.srinjaydg.in");
        helper.setTo(to);
        helper.setSubject("Your borrow request for \"" + bookTitle + "\" was rejected");

        String htmlContent = templateEngine.process(EmailTemplatename.BORROW_REQUEST_REJECTED.getName(), context);
        helper.setText(htmlContent, true);
        helper.addInline("logoImage", new ClassPathResource("static/logo.png"));

        mailSender.send(mimeMessage);
    }

    @Async
    public void sendReturnCompletedEmail(
            String to,
            String borrowerName,
            String lenderName,
            String bookTitle
    ) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, UTF_8.name());

        Map<String, Object> props = new HashMap<>();
        props.put("borrowerName", borrowerName);
        props.put("lenderName", lenderName);
        props.put("bookTitle", bookTitle);
        props.put("exploreUrl", frontendUrl);

        Context context = new Context();
        context.setVariables(props);

        helper.setFrom("info@enderbrary.srinjaydg.in");
        helper.setTo(to);
        helper.setSubject("Return of \"" + bookTitle + "\" is complete");

        String htmlContent = templateEngine.process(EmailTemplatename.RETURN_REQUEST_COMPLETED.getName(), context);
        helper.setText(htmlContent, true);
        helper.addInline("logoImage", new ClassPathResource("static/logo.png"));

        mailSender.send(mimeMessage);
    }

    @Async
    public void sendReturnRequestedEmail(
            String to,
            String lenderName,
            String borrowerName,
            String bookTitle,
            String verifyReturnUrl
    ) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, UTF_8.name());

        Map<String, Object> props = new HashMap<>();
        props.put("lenderName", lenderName);
        props.put("borrowerName", borrowerName);
        props.put("bookTitle", bookTitle);
        props.put("verifyReturnUrl", verifyReturnUrl);

        Context context = new Context();
        context.setVariables(props);

        helper.setFrom("info@enderbrary.srinjaydg.in");
        helper.setTo(to);
        helper.setSubject("Return requested for \"" + bookTitle + "\"");

        String htmlContent = templateEngine.process(EmailTemplatename.RETURN_REQUEST.getName(), context);
        helper.setText(htmlContent, true);
        helper.addInline("logoImage", new ClassPathResource("static/logo.png"));

        mailSender.send(mimeMessage);
    }

}
