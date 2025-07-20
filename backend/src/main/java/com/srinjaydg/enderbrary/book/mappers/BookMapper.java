package com.srinjaydg.enderbrary.book.mappers;

import com.srinjaydg.enderbrary.book.models.Book;
import com.srinjaydg.enderbrary.book.request.BookRequest;
import com.srinjaydg.enderbrary.book.response.BookResponse;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {

    public Book toBook(BookRequest request) {
        if (request == null) return null;

        return Book.builder()
                .title(request.title())
                .author(request.author())
                .description(request.description())
                .category(request.category())
                .coverUrl(request.coverUrl())
                .build();
    }

    public BookResponse toBookResponse(Book book) {
        if (book == null) return null;

        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .category(book.getCategory())
                .coverUrl(book.getCoverUrl())
                .isAvailable(book.getIsAvailable())
                .isArchived(book.getIsArchived())
                .ownerName(book.getOwner() != null ? book.getOwner().getName() : null)
                .ownerEmail(book.getOwner() != null ? book.getOwner().getEmail() : null)
                .ownerImageUrl(book.getOwner() != null ? book.getOwner().getImageUrl() : null)
                .build();
    }

}
