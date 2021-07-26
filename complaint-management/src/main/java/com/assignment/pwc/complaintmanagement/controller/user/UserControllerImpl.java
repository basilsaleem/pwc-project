package com.assignment.pwc.complaintmanagement.controller.user;

import com.assignment.pwc.complaintmanagement.controller.UserController;
import com.assignment.pwc.complaintmanagement.controller.util.UserUtil;
import com.assignment.pwc.complaintmanagement.entity.user.RoleType;
import com.assignment.pwc.complaintmanagement.entity.user.User;
import com.assignment.pwc.complaintmanagement.model.auth.LoginForm;
import com.assignment.pwc.complaintmanagement.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/v1")
public class UserControllerImpl<T extends User> implements UserController<T> {


    private final UserRepository userRepository;


    private final UserUtil userUtil;

    public UserControllerImpl(UserRepository userRepository, UserUtil userUtil) {
        this.userRepository = userRepository;
        this.userUtil = userUtil;
    }

    @SuppressWarnings("unchecked")
    @Override
    @PostMapping("/register")
    public T registerByUsernameAndPassword(@Valid @RequestBody @NonNull LoginForm userInfo) {

        userUtil.checkDuplicateEmail(userInfo.getEmail());
        User user = userUtil.prepareUserForCreate(userInfo, RoleType.findByName(userInfo.getUserType()));

        return (T) userRepository.save(user);
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
