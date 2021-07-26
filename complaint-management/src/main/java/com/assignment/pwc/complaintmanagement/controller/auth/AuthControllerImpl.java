package com.assignment.pwc.complaintmanagement.controller.auth;

import com.assignment.pwc.complaintmanagement.controller.AuthController;
import com.assignment.pwc.complaintmanagement.controller.util.JwtGenerator;
import com.assignment.pwc.complaintmanagement.model.auth.JwtAuthResponse;
import com.assignment.pwc.complaintmanagement.model.auth.LoginForm;
import com.assignment.pwc.complaintmanagement.model.auth.UserDetailsImpl;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("api/v1")
public class AuthControllerImpl implements AuthController {

    public final AuthenticationManager authenticationManager;

    private final JwtGenerator jwtGenerator;

    public AuthControllerImpl(AuthenticationManager authenticationManager, JwtGenerator jwtGenerator) {
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
    }


    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateUser(@NotNull @Valid @RequestBody LoginForm authRequest) {

        Authentication authentication;
        try{

            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
        }catch (BadCredentialsException e){
            throw new BadCredentialsException("Incorrect username or password", e);
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String accessToken = jwtGenerator.generateJwtToken(userDetails);

        return ResponseEntity.ok(new JwtAuthResponse(userDetails, accessToken, jwtGenerator.getTokenExpirationTime()));

    }
}
