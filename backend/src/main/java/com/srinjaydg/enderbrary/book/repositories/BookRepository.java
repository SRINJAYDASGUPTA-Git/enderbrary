package com.srinjaydg.enderbrary.book.repositories;

import com.srinjaydg.enderbrary.book.models.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookRepository extends JpaRepository<Book, UUID> {
    List<Book> findByOwnerId(UUID ownerId);
    Page<Book> findByIsAvailableTrueAndIsArchivedFalse(Pageable pageable);

    Optional<Book> findByIdAndOwnerId(UUID id, UUID ownerId);

    List<Book> findByOwnerIdAndIsArchivedTrue(UUID id);

    @Query("""
            SELECT b FROM Book b
            WHERE LOWER(b.title) LIKE CONCAT('%', LOWER(:lowerCase), '%')
            OR LOWER(b.author) LIKE CONCAT('%', LOWER(:lowerCase), '%')
            AND b.isAvailable = true AND b.isArchived = false   
    """)
    List<Book> searchByTitleOrAuthor(String lowerCase);
}
