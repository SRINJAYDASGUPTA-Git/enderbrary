package com.srinjaydg.enderbrary.book.request;

public record BookRequest(
        String title,
        String author,
        String description,
        String category,
        String coverUrl
) {}
