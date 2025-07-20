package com.srinjaydg.enderbrary.exceptions;

public class ExistingEmailConflictException extends RuntimeException {
    public ExistingEmailConflictException(String message) {
        super(message);
    }
}
