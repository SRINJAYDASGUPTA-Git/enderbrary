package com.srinjaydg.enderbrary.user.controllers;

import com.srinjaydg.enderbrary.auth.AuthenticationService;
import com.srinjaydg.enderbrary.user.dto.UserResponse;
import com.srinjaydg.enderbrary.user.dto.UserUpdateRequest;
import com.srinjaydg.enderbrary.user.models.User;
import com.srinjaydg.enderbrary.user.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Endpoints for managing user profiles and information")
public class UserController {

    private final UserService userService;
    private final AuthenticationService authenticationService;

    @GetMapping("/me")
    @Operation(summary = "Get Current User", description = "Returns the details of the currently authenticated user.")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication connectedUser) {
        return ResponseEntity.ok(userService.getCurrentUser(connectedUser));
    }

    @PutMapping("/me")
    @Operation(summary = "Update Current User", description = "Updates the details of the currently authenticated user.")
    public ResponseEntity<UserResponse> updateCurrentUser(Authentication connectedUser,
                                                          @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateCurrentUser(connectedUser, request));
    }

    @GetMapping("/send-verification-email")
    @Operation(summary = "Send Verification Email", description = "Sends a verification email to the user.")
    public ResponseEntity<Void> sendVerificationEmail(Authentication connectedUser) throws MessagingException {
        User user = (User) connectedUser.getPrincipal();
        authenticationService.sendActivationEmail(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get User by ID", description = "Returns user details for a specific user ID.")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    @Operation(summary = "Get All Users", description = "Returns a list of all registered users.")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/me")
    @Operation(summary = "Deactivate Current User", description = "Deactivates the account of the currently authenticated user.")
    public ResponseEntity<Void> deactivateCurrentUser(Authentication connectedUser) {
        userService.deactivateCurrentUser(connectedUser);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/with-books")
    @Operation(summary = "Get Users With Books", description = "Returns all users who have at least one book posted.")
    public ResponseEntity<List<UserResponse>> getUsersWithBooks() {
        return ResponseEntity.ok(userService.getUsersWithBooks());
    }
}
