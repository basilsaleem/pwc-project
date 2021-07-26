package com.assignment.pwc.complaintmanagement.service;

import com.assignment.pwc.complaintmanagement.entity.user.User;
import com.assignment.pwc.complaintmanagement.exception.EntityNotFoundException;
import com.assignment.pwc.complaintmanagement.model.auth.UserDetailsImpl;
import com.assignment.pwc.complaintmanagement.repo.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        Optional<User> userEntity = userRepository.findByEmail(s);
        return new UserDetailsImpl.Builder(
                userEntity.orElseThrow(() -> new EntityNotFoundException("User not found!"))
        ).build();
    }
}
