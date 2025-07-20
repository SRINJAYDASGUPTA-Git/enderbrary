package com.srinjaydg.enderbrary.book.controllers;

import com.srinjaydg.enderbrary.book.request.BookRequest;
import com.srinjaydg.enderbrary.book.response.BookResponse;
import com.srinjaydg.enderbrary.book.services.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
@Tag(name = "Book Management", description = "Endpoints for managing books")
public class BookController {

    private final BookService bookService;

    @PostMapping
    @Operation(summary = "Add a Book")
    public ResponseEntity<BookResponse> addBook(@RequestBody BookRequest request, Authentication connectedUser) {
        return ResponseEntity.ok(bookService.addBook(request, connectedUser));
    }

    @GetMapping
    @Operation(summary = "List Available Books")
    public ResponseEntity<List<BookResponse>> getAllAvailableBooks(Authentication connectedUser) {
        return ResponseEntity.ok(bookService.getAllBooks(connectedUser));
    }

    @GetMapping("/me")
    @Operation(summary = "List My Books")
    public ResponseEntity<List<BookResponse>> getMyBooks(Authentication connectedUser) {
        return ResponseEntity.ok(bookService.getBooksByOwner(connectedUser));
    }

    @GetMapping("/me/archived")
    @Operation(summary = "List My Archived Books")
    public ResponseEntity<List<BookResponse>> getArchivedBooks(Authentication connectedUser) {
        return ResponseEntity.ok(bookService.getArchivedBooksByOwner(connectedUser));
    }

    @PatchMapping("/{bookId}/archive")
    @Operation(summary = "Archive Book")
    public ResponseEntity<BookResponse> archiveBook(@PathVariable UUID bookId, Authentication connectedUser) {
        return ResponseEntity.ok(bookService.archiveBook(bookId, connectedUser));
    }

    @DeleteMapping("/{bookId}")
    @Operation(summary = "Delete Book")
    public ResponseEntity<Void> deleteBook(@PathVariable UUID bookId, Authentication connectedUser) {
        bookService.deleteBook(bookId, connectedUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search Books", description = "Search books by keyword in title or author.")
    public ResponseEntity<List<BookResponse>> searchBooks(@RequestParam String keyword) {
        return ResponseEntity.ok(bookService.searchBooks(keyword));
    }

    @GetMapping("/{bookId}")
    @Operation(summary = "Get Book by ID")
    public ResponseEntity<BookResponse> getBookById(@PathVariable UUID bookId) {
        return ResponseEntity.ok(bookService.getBookDetails(bookId));
    }
}
