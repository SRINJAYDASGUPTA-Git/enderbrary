package com.srinjaydg.enderbrary.email;

import lombok.Getter;

@Getter
public enum EmailTemplatename {

    ACTIVATE_ACCOUNT("activate_account"),
    BORROW_REQUEST("borrow_request"),
    BORROW_REQUEST_APPROVED("borrow_request_approved"),
    BORROW_REQUEST_REJECTED("borrow_request_rejected"),
    RETURN_REQUEST("return_request"),
    RETURN_REQUEST_COMPLETED("return_completed"),
    ;

    private final String name;

    EmailTemplatename(String name) {
        this.name = name;
    }
}
