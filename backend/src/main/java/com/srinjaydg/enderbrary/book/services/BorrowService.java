package com.srinjaydg.enderbrary.book.services;

import com.srinjaydg.enderbrary.book.enums.BorrowStatus;
import com.srinjaydg.enderbrary.book.mappers.BorrowRequestMapper;
import com.srinjaydg.enderbrary.book.models.Book;
import com.srinjaydg.enderbrary.book.models.BorrowRequest;
import com.srinjaydg.enderbrary.book.repositories.BookRepository;
import com.srinjaydg.enderbrary.book.repositories.BorrowRequestRepository;
import com.srinjaydg.enderbrary.book.response.BorrowRequestResponse;
import com.srinjaydg.enderbrary.email.EmailService;
import com.srinjaydg.enderbrary.email.EmailTemplatename;
import com.srinjaydg.enderbrary.user.models.User;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BorrowService {

    @Value("${application.mailing.frontend.manage-request-url}")
    private String manageRequestUrl;

    private final BorrowRequestRepository borrowRequestRepository;
    private final BorrowRequestMapper borrowRequestMapper;
    private final BookRepository bookRepository;
    private final EmailService emailService;

    public BorrowRequestResponse create(UUID bookId, Authentication authentication) throws MessagingException, UnsupportedEncodingException {
        log.info("Creating borrow request for book ID: {}", bookId);
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NoSuchElementException("Book not found with ID: " + bookId));
        User borrower = (User) authentication.getPrincipal();

        BorrowRequest newRequest = BorrowRequest.builder()
                .book(book)
                .borrower(borrower)
                .lender(book.getOwner())
                .requestDate(LocalDateTime.now())
                .status(BorrowStatus.PENDING)
                .dueDate(LocalDateTime.now().plusDays(14))
                .build();

        BorrowRequest savedRequest = borrowRequestRepository.save(newRequest);
        sendBorrowRequestNotification(savedRequest);
        return borrowRequestMapper.toResponse(savedRequest);
    }

    public BorrowRequestResponse approve(UUID requestId, Authentication authentication) throws MessagingException, UnsupportedEncodingException {
        log.info("Approving borrow request ID: {}", requestId);
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new NoSuchElementException("Borrow request not found with ID: " + requestId));

        User lender = (User) authentication.getPrincipal();
        if (!borrowRequest.getLender().getId().equals(lender.getId())) {
            throw new IllegalArgumentException("You are not authorized to approve this request");
        }

        borrowRequest.setStatus(BorrowStatus.APPROVED);
        BorrowRequest updatedRequest = borrowRequestRepository.save(borrowRequest);

        Book book = borrowRequest.getBook();
        book.setIsAvailable(false);
        bookRepository.save(book);
        sendApprovalNotification(updatedRequest);
        return borrowRequestMapper.toResponse(updatedRequest);
    }

    public BorrowRequestResponse reject(UUID requestId, Authentication authentication) throws MessagingException, UnsupportedEncodingException {
        log.info("Rejecting borrow request ID: {}", requestId);
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new NoSuchElementException("Borrow request not found with ID: " + requestId));

        User lender = (User) authentication.getPrincipal();
        if (!borrowRequest.getLender().getId().equals(lender.getId())) {
            throw new IllegalArgumentException("You are not authorized to reject this request");
        }

        borrowRequest.setStatus(BorrowStatus.REJECTED);
        BorrowRequest updatedRequest = borrowRequestRepository.save(borrowRequest);
        sendRejectionNotification(updatedRequest);
        return borrowRequestMapper.toResponse(updatedRequest);
    }

    public BorrowRequestResponse getBorrowRequest(UUID requestId) {
        log.info("Fetching borrow request ID: {}", requestId);
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new NoSuchElementException("Borrow request not found with ID: " + requestId));
        return borrowRequestMapper.toResponse(borrowRequest);
    }

    public List<BorrowRequestResponse> getAllBorrowRequestsForUser(Authentication authentication) {
        log.info("Fetching all borrow requests for user");
        User user = (User) authentication.getPrincipal();
        List<BorrowRequest> borrowRequests = borrowRequestRepository.findByBorrowerId(user.getId());
        return borrowRequests.stream()
                .map(borrowRequestMapper::toResponse)
                .toList();
    }

    public List<BorrowRequestResponse> getAllBorrowRequestsToUser(Authentication authentication) {
        log.info("Fetching all borrow requests to user");
        User user = (User) authentication.getPrincipal();
        List<BorrowRequest> borrowRequests = borrowRequestRepository.findByLenderId(user.getId());
        return borrowRequests.stream()
                .map(borrowRequestMapper::toResponse)
                .toList();
    }

    public List<BorrowRequestResponse> getAllBorrowRequestsForBook(UUID bookId, Authentication authentication) {
        log.info("Fetching all borrow requests for book ID: {}", bookId);
        User user = (User) authentication.getPrincipal();
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NoSuchElementException("Book not found with ID: " + bookId));
        if (!book.getOwner().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You are not authorized to view borrow requests for this book");
        }
        List<BorrowRequest> borrowRequests = borrowRequestRepository.findByBookIdAndLenderId(bookId, user.getId());
        return borrowRequests.stream()
                .map(borrowRequestMapper::toResponse)
                .toList();
    }

    public List<BorrowRequestResponse> getPendingRequestsForUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return borrowRequestRepository.findByBorrowerIdAndStatus(user.getId(), BorrowStatus.PENDING).stream()
                .map(borrowRequestMapper::toResponse)
                .toList();
    }

    public List<BorrowRequestResponse> getApprovedBorrows(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return borrowRequestRepository.findByBorrowerIdAndStatus(user.getId(), BorrowStatus.APPROVED).stream()
                .map(borrowRequestMapper::toResponse)
                .toList();
    }

    public List<BorrowRequestResponse> getLentBooks(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return borrowRequestRepository.findByLenderIdAndStatus(user.getId(), BorrowStatus.APPROVED).stream()
                .map(borrowRequestMapper::toResponse)
                .toList();
    }

    public BorrowRequestResponse returnBook(UUID requestId, Authentication authentication) throws MessagingException, UnsupportedEncodingException {
        log.info("Returning book for borrow request ID: {}", requestId);
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new NoSuchElementException("Borrow request not found with ID: " + requestId));

        User borrower = (User) authentication.getPrincipal();
        if (!borrowRequest.getBorrower().getId().equals(borrower.getId())) {
            throw new IllegalArgumentException("You are not authorized to return this book");
        }

        borrowRequest.setStatus(BorrowStatus.RETURN_REQUESTED);

        BorrowRequest updatedRequest = borrowRequestRepository.save(borrowRequest);
        sendReturnRequestedNotification(updatedRequest);
        return borrowRequestMapper.toResponse(updatedRequest);
    }

    public BorrowRequestResponse completeReturn(UUID requestId, Authentication authentication) throws MessagingException, UnsupportedEncodingException {
        log.info("Completing return for borrow request ID: {}", requestId);
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new NoSuchElementException("Borrow request not found with ID: " + requestId));

        User lender = (User) authentication.getPrincipal();
        if (!borrowRequest.getLender().getId().equals(lender.getId())) {
            throw new IllegalArgumentException("You are not authorized to complete the return for this request");
        }

        borrowRequest.setStatus(BorrowStatus.RETURNED);
        Book book = borrowRequest.getBook();
        book.setIsAvailable(true);
        bookRepository.save(book);

        BorrowRequest updatedRequest = borrowRequestRepository.save(borrowRequest);
        sendReturnCompletedNotification(updatedRequest);
        return borrowRequestMapper.toResponse(updatedRequest);
    }


    private void sendBorrowRequestNotification(BorrowRequest borrowRequest) throws MessagingException, UnsupportedEncodingException {
        log.info("Sending notification for borrow request ID: {}", borrowRequest.getId());
        emailService.sendBorrowRequestMail(
                borrowRequest.getLender().getEmail(),
                borrowRequest.getLender().getName(),
                borrowRequest.getBorrower().getName(),
                borrowRequest.getBook().getTitle(),
                EmailTemplatename.BORROW_REQUEST,
                manageRequestUrl
        );
    }
    private String buildManageRequestUrl(UUID requestId) {
        return manageRequestUrl + "?requestId=" + requestId;
    }

    private void sendApprovalNotification(BorrowRequest borrowRequest) throws MessagingException, UnsupportedEncodingException {
        log.info("Sending approval email for borrow request ID: {}", borrowRequest.getId());
        emailService.sendBorrowApprovedEmail(
                borrowRequest.getBorrower().getEmail(),
                borrowRequest.getBorrower().getName(),
                borrowRequest.getLender().getName(),
                borrowRequest.getBook().getTitle(),
                buildManageRequestUrl(borrowRequest.getId())
        );
    }

    private void sendRejectionNotification(BorrowRequest borrowRequest) throws MessagingException, UnsupportedEncodingException {
        log.info("Sending rejection email for borrow request ID: {}", borrowRequest.getId());
        emailService.sendBorrowRejectedEmail(
                borrowRequest.getBorrower().getEmail(),
                borrowRequest.getBorrower().getName(),
                borrowRequest.getLender().getName(),
                borrowRequest.getBook().getTitle()
        );
    }

    private void sendReturnRequestedNotification(BorrowRequest borrowRequest) throws MessagingException, UnsupportedEncodingException {
        log.info("Sending return requested email for borrow request ID: {}", borrowRequest.getId());
        emailService.sendReturnRequestedEmail(
                borrowRequest.getLender().getEmail(),
                borrowRequest.getLender().getName(),
                borrowRequest.getBorrower().getName(),
                borrowRequest.getBook().getTitle(),
                buildManageRequestUrl(borrowRequest.getId())
        );
    }

    private void sendReturnCompletedNotification(BorrowRequest borrowRequest) throws MessagingException, UnsupportedEncodingException {
        log.info("Sending return completed email for borrow request ID: {}", borrowRequest.getId());
        emailService.sendReturnCompletedEmail(
                borrowRequest.getBorrower().getEmail(),
                borrowRequest.getBorrower().getName(),
                borrowRequest.getLender().getName(),
                borrowRequest.getBook().getTitle(),
                buildManageRequestUrl(borrowRequest.getId())
        );
    }

}
