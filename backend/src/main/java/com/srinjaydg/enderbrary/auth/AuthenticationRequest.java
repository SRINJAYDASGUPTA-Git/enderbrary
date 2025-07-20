package com.srinjaydg.enderbrary.auth;

import lombok.Builder;

@Builder
public record AuthenticationRequest(
        String email,
        String password,
        String name,
        String image
) {
}
