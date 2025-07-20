package com.srinjaydg.enderbrary.book.repositories;

import com.srinjaydg.enderbrary.book.enums.BorrowStatus;
import com.srinjaydg.enderbrary.book.models.BorrowRequest;
import io.micrometer.common.KeyValues;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, UUID> {
    List<BorrowRequest> findByBorrowerId(UUID borrowerId);
    List<BorrowRequest> findByLenderId(UUID lenderId);

    List<BorrowRequest> findByBookIdAndLenderId(UUID bookId, UUID id);

    List<BorrowRequest> findByBorrowerIdAndStatus(UUID id, BorrowStatus borrowStatus);

    List<BorrowRequest> findByLenderIdAndStatus(UUID id, BorrowStatus borrowStatus);
}
