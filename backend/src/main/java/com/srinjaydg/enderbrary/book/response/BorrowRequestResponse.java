package com.srinjaydg.enderbrary.book.response;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record BorrowRequestResponse(
        UUID id,
        UUID bookId,
        String bookTitle,
        String lenderName,
        String borrowerName,
        String borrowerEmail,
        String borrowerImageUrl,
        LocalDateTime requestDate,
        LocalDateTime dueDate,
        String status
) {}
