package com.srinjaydg.enderbrary.book.mappers;

import com.srinjaydg.enderbrary.book.models.BorrowRequest;
import com.srinjaydg.enderbrary.book.response.BorrowRequestResponse;
import org.springframework.stereotype.Component;

@Component
public class BorrowRequestMapper {

    public BorrowRequestResponse toResponse(BorrowRequest request) {
        if (request == null) return null;

        return BorrowRequestResponse.builder()
                .id(request.getId())
                .bookId(request.getBook().getId())
                .bookTitle(request.getBook().getTitle())
                .lenderName(request.getLender().getName())
                .borrowerName(request.getBorrower().getName())
                .borrowerEmail(request.getBorrower().getEmail())
                .borrowerImageUrl(request.getBorrower().getImageUrl())
                .requestDate(request.getRequestDate())
                .dueDate(request.getDueDate())
                .status(request.getStatus().name())
                .build();
    }
}
