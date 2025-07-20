package com.srinjaydg.enderbrary.book.response;

import lombok.Builder;

import java.util.UUID;
@Builder
public record BookResponse(
        UUID id,
        String title,
        String author,
        String description,
        String category,
        String coverUrl,
        Boolean isAvailable,
        Boolean isArchived,
        String ownerName,
        String ownerEmail,
        String ownerImageUrl
) {}

