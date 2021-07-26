package com.assignment.pwc.complaintmanagement.controller.util;

import com.assignment.pwc.complaintmanagement.entity.user.Role;
import com.assignment.pwc.complaintmanagement.entity.user.RoleType;
import com.assignment.pwc.complaintmanagement.entity.user.User;
import com.assignment.pwc.complaintmanagement.exception.DuplicateEntityException;
import com.assignment.pwc.complaintmanagement.exception.EntityNotFoundException;
import com.assignment.pwc.complaintmanagement.model.auth.LoginForm;
import com.assignment.pwc.complaintmanagement.repo.RoleRepository;
import com.assignment.pwc.complaintmanagement.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserUtil {


    private final UserRepository userRepo;
    private PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public UserUtil(UserRepository userRepository, RoleRepository roleRepository){
        this.userRepo = userRepository;
        this.roleRepository = roleRepository;
    }

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder){
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * <P>Method to check if the user is already exist in the database, throws {@link DuplicateEntityException} if true otherwise ignore</P>
     * @param email userdata
     * @throws DuplicateEntityException if user's username is already exist in the database
     */
    public void checkDuplicateEmail(@NonNull String email){
        userRepo.findByEmail(email).ifPresent(user -> {
            throw new DuplicateEntityException("User with "+ user.getEmail() + " is already exist");
        });
    }

    /**
     *  Hash the user password and add user's role
     * @param userInfo User to be created
     * @param roleType User role whether it's admin or user
     * @return
     */
    @NonNull
    public User prepareUserForCreate(LoginForm userInfo, RoleType roleType){

        User user = new User();
        user.setPassword(userInfo.getPassword());
        user.setEmail(userInfo.getEmail());

        String hashedPassword = passwordEncoder.encode(userInfo.getPassword());
        user.setPassword(hashedPassword);
        user.addRole(findOrCreate(roleType));

        return user;
    }

    /**
     * Find or create {@link Role}
     * @param roleType
     * @return
     */
    public Role findOrCreate(RoleType roleType){
        return roleRepository.findByName(roleType.getRoleName())
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(roleType.getRoleName());
                    roleRepository.save(role);
                    return role;
                });

    }

    public boolean hasRole(long userId, RoleType roleType){
      User user = userRepo.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
      return user.getRoles().stream().anyMatch(role -> role.getName().equals(roleType.getRoleName()));
    }
}
