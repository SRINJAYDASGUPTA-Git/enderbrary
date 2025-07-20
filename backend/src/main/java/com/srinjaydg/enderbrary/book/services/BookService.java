package com.srinjaydg.enderbrary.book.services;

import com.srinjaydg.enderbrary.book.mappers.BookMapper;
import com.srinjaydg.enderbrary.book.models.Book;
import com.srinjaydg.enderbrary.book.repositories.BookRepository;
import com.srinjaydg.enderbrary.book.request.BookRequest;
import com.srinjaydg.enderbrary.book.response.BookResponse;
import com.srinjaydg.enderbrary.user.models.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    public BookResponse addBook(BookRequest request, Authentication connectedUser) {
        User owner = (User) connectedUser.getPrincipal();
        Book book = bookMapper.toBook(request);
        book.setOwner(owner);
        book.setIsAvailable(true);
        book.setIsArchived(false);
        Book saved = bookRepository.save(book);
        return bookMapper.toBookResponse(saved);
    }

    public List<BookResponse> getAllBooks(Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        if (user == null) {
            log.error("User not authenticated");
            throw new BadCredentialsException("User not authenticated");
        }
        List<Book> books = bookRepository.findByIsAvailableTrueAndIsArchivedFalse();
        return books.stream()
                .map(bookMapper::toBookResponse)
                .toList();
    }

    public List<BookResponse> getBooksByOwner(Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        List<Book> books = bookRepository.findByOwnerId(user.getId());
        if (books.isEmpty()) {
            log.error("No books found for user with ID: {}", user.getId());
            throw new NoSuchElementException("No books found for user");
        }
        return books.stream()
                .map(bookMapper::toBookResponse)
                .toList();
    }

    public BookResponse archiveBook(UUID bookId, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Book book = bookRepository.findByIdAndOwnerId(bookId, user.getId())
                .orElseThrow(() -> new NoSuchElementException("Book not found or not owned by user"));
        book.setIsArchived(true);
        Book archivedBook = bookRepository.save(book);
        return bookMapper.toBookResponse(archivedBook);
    }

    public BookResponse getBookDetails(UUID bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NoSuchElementException("Book not found"));
        return bookMapper.toBookResponse(book);
    }

    public List<BookResponse> getArchivedBooksByOwner(Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        List<Book> books = bookRepository.findByOwnerIdAndIsArchivedTrue(user.getId());
        return books.stream()
                .map(bookMapper::toBookResponse)
                .toList();
    }

    public List<BookResponse> searchBooks(String keyword) {
        List<Book> books = bookRepository.searchByTitleOrAuthor(keyword.toLowerCase());
        return books.stream()
                .map(bookMapper::toBookResponse)
                .toList();
    }

    public BookResponse markBookAsReturned(UUID bookId, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Book book = bookRepository.findByIdAndOwnerId(bookId, user.getId())
                .orElseThrow(() -> new NoSuchElementException("Book not found or not owned by user"));
        book.setIsAvailable(true);
        Book updated = bookRepository.save(book);
        return bookMapper.toBookResponse(updated);
    }

    public void deleteBook(UUID bookId, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Book book = bookRepository.findByIdAndOwnerId(bookId, user.getId())
                .orElseThrow(() -> new NoSuchElementException("Book not found or not owned by user"));
        bookRepository.delete(book);
    }
}
