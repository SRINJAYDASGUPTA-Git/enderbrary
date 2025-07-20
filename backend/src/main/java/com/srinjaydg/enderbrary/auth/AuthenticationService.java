package com.srinjaydg.enderbrary.auth;

import com.srinjaydg.enderbrary.email.EmailService;
import com.srinjaydg.enderbrary.email.EmailTemplatename;
import com.srinjaydg.enderbrary.exceptions.ExistingEmailConflictException;
import com.srinjaydg.enderbrary.security.JWTService;
import com.srinjaydg.enderbrary.user.models.Token;
import com.srinjaydg.enderbrary.user.models.User;
import com.srinjaydg.enderbrary.user.repositories.RoleRepository;
import com.srinjaydg.enderbrary.user.repositories.TokenRepository;
import com.srinjaydg.enderbrary.user.repositories.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JWTService jWTService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;

    @Value ("${application.mailing.frontend.activation-url}")
    private String activationUrl;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";
    private static final int PASSWORD_LENGTH = 16;

    public AuthenticationResponse login(AuthenticationRequest authenticationRequest) {
        User user = userRepository.findByEmail(authenticationRequest.email())
                .orElseThrow(() -> new NoSuchElementException ("User not found"));
        return getAuthenticationResponse(authenticationRequest);
    }

    public void register(AuthenticationRequest authenticationRequest) throws BadRequestException, MessagingException {
        var userRole = roleRepository.findByName("USER")
                .orElseThrow (() -> new IllegalStateException ("ROLE USER was not initialized"));

        if (userRepository.existsByEmail(authenticationRequest.email())) {
            throw new ExistingEmailConflictException("Email already exists");
        }
        if (authenticationRequest.name() == null || authenticationRequest.email() == null || authenticationRequest.password() == null) {
            throw new BadRequestException("Name, email, and password must not be null");
        }
        User user = User.builder()
                .name(authenticationRequest.name())
                .email(authenticationRequest.email())
                .password(passwordEncoder.encode (authenticationRequest.password()))
                .imageUrl (authenticationRequest.image () == null ? "https://avatar.vercel.sh/"+authenticationRequest.name ()+"?rounded=60" : authenticationRequest.image ())
                .accountLocked (false)
                .enabled (false)
                .roles (List.of (userRole))
                .build();

        userRepository.save(user);
        sendActivationEmail(user);
    }

    public void sendActivationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken (user);
        emailService.sendActivationMail(
                user.getEmail(),
                user.getName(),
                EmailTemplatename.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Activate your account"
        );
    }

    private String generateAndSaveActivationToken(User user) {
        String generatedToken = generateActivationCode();

        var token = Token.builder ()
                .token (generatedToken)
                .createdAt (LocalDateTime.now ())
                .expiresAt (LocalDateTime.now ().plusMinutes (15))
                .user (user)
                .build ();
        tokenRepository.save (token);
        return generatedToken;
    }

    private String generateActivationCode() {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom ();
        for (int i = 0; i < 6; i++) {
            int randomIndex = secureRandom.nextInt (characters.length ());
            codeBuilder.append (characters.charAt (randomIndex));
        }
        return codeBuilder.toString ();
    }

    public AuthenticationResponse activateAccount(String token) throws MessagingException {
        Token savedToken = tokenRepository.findByToken (token)
                .orElseThrow (() -> new NoSuchElementException ("Token not found"));

        if(LocalDateTime.now ().isAfter (savedToken.getExpiresAt ())){
            sendActivationEmail (savedToken.getUser ());
            throw new RuntimeException ("Token expired. New token sent to email");
        }

        var user = userRepository.findById (savedToken.getUser ().getId ())
                .orElseThrow (() -> new NoSuchElementException ("User not found"));
        user.setEnabled (true);
        userRepository.save (user);
        savedToken.setValidatedAt (LocalDateTime.now ());
        tokenRepository.save (savedToken);
        return buildJwtResponse(user);
    }

    private AuthenticationResponse getAuthenticationResponse(AuthenticationRequest authenticationRequest) {
        var auth = authenticationManager.authenticate (
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.email (),
                        authenticationRequest.password ()
                )
        );
        var userVar = ((User) auth.getPrincipal ());
        return buildJwtResponse(userVar);
    }

    public AuthenticationResponse oauth2Login(AuthenticationRequest request) throws MessagingException {
        User user = userRepository.findByEmail(request.email())
                .orElse(null);
        if (user != null) {
            return buildJwtResponse(user);
        }
        // If user does not exist, register them
            AuthenticationRequest requestWithPassword = AuthenticationRequest.builder ()
                    .email(request.email())
                    .name(request.name())
                    .image (request.image ())
                    .password(generateSecurePassword())
                    .build ();
            User newUser = User.builder()
                    .name(requestWithPassword.name())
                    .email(requestWithPassword.email())
                    .password(passwordEncoder.encode(requestWithPassword.password()))
                    .imageUrl(requestWithPassword.image())
                    .accountLocked (false)
                    .enabled (false)
                    .roles(List.of(roleRepository.findByName("USER")
                            .orElseThrow(() -> new IllegalStateException("ROLE USER was not initialized"))))
                    .build();
            userRepository.save(newUser);
            sendActivationEmail(newUser);
            return null;
    }

    private static String generateSecurePassword() {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int index = random.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(index));
        }

        return password.toString();
    }

    private AuthenticationResponse buildJwtResponse(User user){
        var claims = new HashMap<String, Object>();
        claims.put ("user_email", user.getUsername ());
        var jwtToken = jWTService.generateAccessToken (
                claims,
                user
        );

        var refreshToken = jWTService.generateRefreshToken (
                claims,
                user
        );

        return AuthenticationResponse.builder ()
                .access_token (jwtToken)
                .refresh_token (refreshToken)
                .build ();
    }

    @Transactional
    public AuthenticationResponse refreshToken(Authentication connectedUser) {
        User principal = (User) connectedUser.getPrincipal();
        User user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        return buildJwtResponse(user);
    }
}
