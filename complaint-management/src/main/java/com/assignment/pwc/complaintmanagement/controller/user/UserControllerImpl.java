package com.assignment.pwc.complaintmanagement.controller.user;

import com.assignment.pwc.complaintmanagement.controller.UserController;
import com.assignment.pwc.complaintmanagement.controller.util.JwtGenerator;
import com.assignment.pwc.complaintmanagement.controller.util.UserUtil;
import com.assignment.pwc.complaintmanagement.entity.user.RoleType;
import com.assignment.pwc.complaintmanagement.entity.user.User;
import com.assignment.pwc.complaintmanagement.model.auth.JwtAuthResponse;
import com.assignment.pwc.complaintmanagement.model.auth.LoginForm;
import com.assignment.pwc.complaintmanagement.model.auth.UserDetailsImpl;
import com.assignment.pwc.complaintmanagement.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/v1")
public class UserControllerImpl<T extends User> implements UserController<T> {


    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;
    private final UserUtil userUtil;

    private final JwtGenerator jwtGenerator;

    public UserControllerImpl(UserRepository userRepository, UserUtil userUtil,
                              AuthenticationManager authenticationManager, JwtGenerator jwtGenerator) {
        this.userRepository = userRepository;
        this.userUtil = userUtil;
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
    }

    @SuppressWarnings("unchecked")
    @Override
    @PostMapping("/register")
    public ResponseEntity<JwtAuthResponse> registerByUsernameAndPassword(@Valid @RequestBody @NonNull LoginForm userInfo) {

        userUtil.checkDuplicateEmail(userInfo.getEmail());
        User user = userUtil.prepareUserForCreate(userInfo, RoleType.findByName(userInfo.getRole()));
        userRepository.save(user);

        Authentication authentication;
        try{

            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(userInfo.getEmail(), userInfo.getPassword()));
        }catch (BadCredentialsException e){
            throw new BadCredentialsException("Incorrect username or password", e);
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String accessToken = jwtGenerator.generateJwtToken(userDetails);

        return ResponseEntity.ok(new JwtAuthResponse(userDetails, accessToken, jwtGenerator.getTokenExpirationTime()));
    }

    @SuppressWarnings("unchecked")
    @Override
    @PreAuthorize("@authUtil.isUserGranted(#id)")
    @GetMapping("/users/{id}")
    public ResponseEntity<T> findUserById(@PathVariable("id") Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return (ResponseEntity<T>) ResponseEntity.ok().body(user);
    }

    @Override
    @PreAuthorize("@authUtil.isAdmin()")
    @GetMapping("/users")
    public List<T> findAllUsers() {
        return (List<T>) userRepository.findAll();
    }


}
