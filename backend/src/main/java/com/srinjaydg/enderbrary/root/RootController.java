package com.srinjaydg.enderbrary.root;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping("/")
    @Operation(
            summary = "Root Endpoint",
            description = "Returns a message indicating that the EnderBrary API server is running successfully."
    )
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("EnderBrary API Server Running successfully!");
    }

}
