package com.srinjaydg.enderbrary.book.models;
import com.srinjaydg.enderbrary.book.enums.BorrowStatus;
import com.srinjaydg.enderbrary.user.models.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne
    @JoinColumn(name = "borrower_id")
    private User borrower;

    @ManyToOne
    @JoinColumn(name = "lender_id")
    private User lender;

    private LocalDateTime requestDate;
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    private BorrowStatus status;
}

