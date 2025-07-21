package com.srinjaydg.enderbrary.configuration;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Properties;

import static org.springframework.http.HttpHeaders.*;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class BeansConfig {
    @Value("${spring.mail.host}")
    String email_host;

    @Value("${spring.mail.port}")
    String email_port;

    @Value("${spring.mail.username}")
    String email_username;

    @Value("${spring.mail.password}")
    String email_password;

    @Value("${spring.mail.properties.mail.smtp.auth}")
    String email_auth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable}")
    String email_starttls;

    @Value("${spring.mail.properties.mail.smtp.ssl.trust}")
    String email_ssl_trust;


    private final UserDetailsService userDetailsService;
    @Bean
    public CorsFilter corsFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials (true);
//        config.setAllowedOrigins (List.of ("*"));
        config.addAllowedOriginPattern("http://localhost:3000");
        config.addAllowedOriginPattern("https://enderbrary.srinjaydg.in");
        config.addAllowedOriginPattern("https://*.vercel.app");
        config.setAllowedHeaders (Arrays.asList (ORIGIN, CONTENT_TYPE, ACCEPT, AUTHORIZATION));
        config.setAllowedMethods (Arrays.asList ("GET", "POST", "PUT", "DELETE", "PATCH"));
        source.registerCorsConfiguration ("/**", config);
        return new CorsFilter(source);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JavaMailSender javaMailSender() {

        Properties properties = new Properties();
        properties.put("mail.smtp.auth", email_auth);
        properties.put("mail.smtp.starttls.enable", email_starttls);
        properties.put("mail.smtp.host", email_host);
        properties.put("mail.smtp.port", email_port);
        properties.put("mail.smtp.ssl.trust", email_ssl_trust);


        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(email_host);
        mailSender.setPort(Integer.parseInt(email_port));
        mailSender.setUsername(email_username);
        mailSender.setPassword(email_password);
        mailSender.setJavaMailProperties(properties);
        return mailSender;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
