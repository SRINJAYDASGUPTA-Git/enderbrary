package com.srinjaydg.enderbrary.book.services;

import com.srinjaydg.enderbrary.book.mappers.BookMapper;
import com.srinjaydg.enderbrary.book.models.Book;
import com.srinjaydg.enderbrary.book.repositories.BookRepository;
import com.srinjaydg.enderbrary.book.request.BookRequest;
import com.srinjaydg.enderbrary.book.response.BookResponse;
import com.srinjaydg.enderbrary.common.PageResponse;
import com.srinjaydg.enderbrary.user.models.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    public PageResponse<BookResponse> getAllBooks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookRepository.findByIsAvailableTrueAndIsArchivedFalse(pageable);
        List<BookResponse> bookResponses = books.stream ()
                .map(bookMapper::toBookResponse).toList ();
        return new PageResponse<> (
                bookResponses,
                books.getNumber (),
                books.getSize (),
                books.getTotalElements (),
                books.getTotalPages (),
                books.isFirst (),
                books.isLast ()
        );
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

    public BookResponse updateBook(UUID bookId, BookRequest request, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Book book = bookRepository.findByIdAndOwnerId(bookId, user.getId())
                .orElseThrow(() -> new NoSuchElementException("Book not found or not owned by user"));

        // Update book details
        book.setTitle(request.title());
        book.setAuthor(request.author());
        book.setCategory(request.category());
        book.setCoverUrl(request.coverUrl());
        book.setDescription(request.description());

        Book updatedBook = bookRepository.save(book);
        return bookMapper.toBookResponse(updatedBook);
    }
}
