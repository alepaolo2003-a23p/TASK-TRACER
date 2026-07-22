package com.aleprojects.tasktracker.dto;

import java.util.UUID;

public class AuthResponse {

    private String token;
    private UUID userId;
    private String username;
    private String email;

    public AuthResponse(String token, UUID userId, String username, String email) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.email = email;
    }

    public String getToken() { return token; }
    public UUID getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
}
