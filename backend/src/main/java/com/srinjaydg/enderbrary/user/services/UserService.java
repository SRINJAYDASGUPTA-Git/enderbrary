package com.srinjaydg.enderbrary.user.services;

import com.srinjaydg.enderbrary.user.dto.UserResponse;
import com.srinjaydg.enderbrary.user.dto.UserUpdateRequest;
import com.srinjaydg.enderbrary.user.mappers.UserMapper;
import com.srinjaydg.enderbrary.user.models.User;
import com.srinjaydg.enderbrary.user.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional
    public UserResponse getCurrentUser(Authentication connectedUser) {
        User principal = (User) connectedUser.getPrincipal();
        User user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        return userMapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse updateCurrentUser(Authentication connectedUser, UserUpdateRequest request) {
        User principal = (User) connectedUser.getPrincipal();
        User user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if (request.name() != null) user.setName(request.name());
        if (request.imageUrl() != null) user.setImageUrl(request.imageUrl());

        userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        return userMapper.toUserResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    @Transactional
    public void deactivateCurrentUser(Authentication connectedUser) {
        User principal = (User) connectedUser.getPrincipal();
        User user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        user.setEnabled(false);
        userRepository.save(user);
        log.info("Deactivated user with ID: {}", user.getId());
    }

    public List<UserResponse> getUsersWithBooks() {
        return userRepository.findUsersWithAtLeastOneBook()
                .stream()
                .map(userMapper::toUserResponse)
                .toList();
    }
}
