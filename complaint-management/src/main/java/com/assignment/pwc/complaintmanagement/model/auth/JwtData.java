package com.assignment.pwc.complaintmanagement.model.auth;

public class JwtData {
    private String accessToken;
    private String email;

    public JwtData( String email, String accessToken) {
        this.accessToken = accessToken;
        this.email = email;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getEmail() {
        return email;
    }
}
