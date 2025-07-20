package com.srinjaydg.enderbrary.user.mappers;

import com.srinjaydg.enderbrary.book.mappers.BookMapper;
import com.srinjaydg.enderbrary.book.mappers.BorrowRequestMapper;
import com.srinjaydg.enderbrary.book.models.BorrowRequest;
import com.srinjaydg.enderbrary.book.response.BookResponse;
import com.srinjaydg.enderbrary.book.response.BorrowRequestResponse;
import com.srinjaydg.enderbrary.user.dto.UserResponse;
import com.srinjaydg.enderbrary.user.models.Role;
import com.srinjaydg.enderbrary.user.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final BookMapper bookMapper;
    private final BorrowRequestMapper borrowRequestMapper;

    public UserResponse toUserResponse(User user) {
        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .toList();

        List<BookResponse> posted = user.getPostedBooks().stream()
                .map(bookMapper::toBookResponse)
                .toList();

        List<BookResponse> lent = user.getLentBooks().stream()
                .map(BorrowRequest::getBook)
                .map(bookMapper::toBookResponse)
                .toList();

        List<BookResponse> borrowed = user.getBorrowedBooks().stream()
                .map(BorrowRequest::getBook)
                .map(bookMapper::toBookResponse)
                .toList();

        List<BorrowRequestResponse> borrowRequests = user.getBorrowedBooks().stream()
                .map(borrowRequestMapper::toResponse)
                .toList();

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .imageUrl(user.getImageUrl())
                .accountLocked(user.getAccountLocked())
                .enabled(user.getEnabled())
                .roles(roles)
                .booksPosted(posted)
                .booksLent(lent)
                .booksBorrowed(borrowed)
                .borrowRequests(borrowRequests)
                .build();
    }
}
