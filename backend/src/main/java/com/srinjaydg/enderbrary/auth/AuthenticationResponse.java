package com.srinjaydg.enderbrary.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class AuthenticationResponse {
    private String access_token;
    private String refresh_token;
}
