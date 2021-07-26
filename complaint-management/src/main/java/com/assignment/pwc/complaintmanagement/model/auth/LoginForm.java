package com.assignment.pwc.complaintmanagement.model.auth;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class LoginForm {

    @NotBlank
    private String email;
    @Size(min = 8, max = 16, message = "Password should be 8 character minimum and 16 max")
    private String password;

    private String userType;

    public LoginForm(String email, String password, String userType) {
        this.email = email;
        this.password = password;
        this.userType = userType;
    }


    public String getUserType() {
        return userType;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
