package com.srinjaydg.enderbrary.user.dto;


import com.srinjaydg.enderbrary.book.response.BookResponse;
import com.srinjaydg.enderbrary.book.response.BorrowRequestResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private UUID id;
    private String name;
    private String email;
    private String imageUrl;
    private Boolean accountLocked;
    private Boolean enabled;
    private List<String> roles;

    private List<BookResponse> booksPosted;         // Books user has listed
    private List<BookResponse> booksLent;           // Books user lent to others
    private List<BookResponse> booksBorrowed;       // Books user has borrowed
    private List<BorrowRequestResponse> borrowRequests; // Optional: user's active/incoming borrow requests
}

