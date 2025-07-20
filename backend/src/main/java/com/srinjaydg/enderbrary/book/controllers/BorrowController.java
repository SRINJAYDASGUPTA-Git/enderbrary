package com.srinjaydg.enderbrary.book.controllers;

import com.srinjaydg.enderbrary.book.response.BorrowRequestResponse;
import com.srinjaydg.enderbrary.book.services.BorrowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/borrow")
@RequiredArgsConstructor
@Tag(name = "Borrow Management", description = "Endpoints for handling borrow requests between users")
public class BorrowController {

    private final BorrowService borrowService;

    @PostMapping("/{bookId}")
    @Operation(summary = "Create Borrow Request")
    public ResponseEntity<BorrowRequestResponse> createBorrowRequest(
            @PathVariable UUID bookId,
            Authentication authentication
    ) throws MessagingException, UnsupportedEncodingException {
        return ResponseEntity.ok(borrowService.create(bookId, authentication));
    }

    @PatchMapping("/{requestId}/approve")
    @Operation(summary = "Approve Borrow Request")
    public ResponseEntity<BorrowRequestResponse> approveRequest(
            @PathVariable UUID requestId,
            Authentication authentication
    ) throws MessagingException, UnsupportedEncodingException {
        return ResponseEntity.ok(borrowService.approve(requestId, authentication));
    }

    @PatchMapping("/{requestId}/reject")
    @Operation(summary = "Reject Borrow Request")
    public ResponseEntity<BorrowRequestResponse> rejectRequest(
            @PathVariable UUID requestId,
            Authentication authentication
    ) throws MessagingException, UnsupportedEncodingException {
        return ResponseEntity.ok(borrowService.reject(requestId, authentication));
    }

    @GetMapping("/{requestId}")
    @Operation(summary = "Get Borrow Request by ID")
    public ResponseEntity<BorrowRequestResponse> getBorrowRequest(@PathVariable UUID requestId) {
        return ResponseEntity.ok(borrowService.getBorrowRequest(requestId));
    }

    @GetMapping("/my-requests")
    @Operation(summary = "Get My Borrow Requests")
    public ResponseEntity<List<BorrowRequestResponse>> getMyBorrowRequests(Authentication authentication) {
        return ResponseEntity.ok(borrowService.getAllBorrowRequestsForUser(authentication));
    }

    @GetMapping("/incoming-requests")
    @Operation(summary = "Get Borrow Requests Made to Me")
    public ResponseEntity<List<BorrowRequestResponse>> getBorrowRequestsToMe(Authentication authentication) {
        return ResponseEntity.ok(borrowService.getAllBorrowRequestsToUser(authentication));
    }

    @GetMapping("/book/{bookId}")
    @Operation(summary = "Get Borrow Requests for a Book")
    public ResponseEntity<List<BorrowRequestResponse>> getRequestsForBook(
            @PathVariable UUID bookId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(borrowService.getAllBorrowRequestsForBook(bookId, authentication));
    }

    @GetMapping("/my-requests/pending")
    @Operation(summary = "Get My Pending Borrow Requests")
    public ResponseEntity<List<BorrowRequestResponse>> getPendingRequests(Authentication authentication) {
        return ResponseEntity.ok(borrowService.getPendingRequestsForUser(authentication));
    }

    @GetMapping("/my-requests/approved")
    @Operation(summary = "Get My Approved Borrow Requests")
    public ResponseEntity<List<BorrowRequestResponse>> getApprovedRequests(Authentication authentication) {
        return ResponseEntity.ok(borrowService.getApprovedBorrows(authentication));
    }

    @GetMapping("/lent")
    @Operation(summary = "Get Books I've Lent Out")
    public ResponseEntity<List<BorrowRequestResponse>> getLentBooks(Authentication authentication) {
        return ResponseEntity.ok(borrowService.getLentBooks(authentication));
    }

    @PatchMapping("/{requestId}/return")
    @Operation(summary = "Request to Return a Borrowed Book")
    public ResponseEntity<BorrowRequestResponse> returnBook(
            @PathVariable UUID requestId,
            Authentication authentication
    ) throws MessagingException, UnsupportedEncodingException {
        return ResponseEntity.ok(borrowService.returnBook(requestId, authentication));
    }

    @PatchMapping("/{requestId}/complete-return")
    @Operation(summary = "Mark Book as Returned (Lender Only)")
    public ResponseEntity<BorrowRequestResponse> completeReturn(
            @PathVariable UUID requestId,
            Authentication authentication
    ) throws MessagingException, UnsupportedEncodingException {
        return ResponseEntity.ok(borrowService.completeReturn(requestId, authentication));
    }
}
