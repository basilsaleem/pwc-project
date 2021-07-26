package com.assignment.pwc.complaintmanagement.controller;

import com.assignment.pwc.complaintmanagement.model.auth.LoginForm;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.Valid;

public interface AuthController {
    ResponseEntity<?> authenticateUser(LoginForm authRequest);
}
