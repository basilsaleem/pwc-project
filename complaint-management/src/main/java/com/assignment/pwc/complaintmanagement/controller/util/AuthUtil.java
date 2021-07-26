package com.assignment.pwc.complaintmanagement.controller.util;

import com.assignment.pwc.complaintmanagement.entity.user.RoleType;
import com.assignment.pwc.complaintmanagement.model.auth.JwtData;
import com.assignment.pwc.complaintmanagement.model.auth.UserDetailsImpl;
import com.assignment.pwc.complaintmanagement.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuthUtil {


    private final UserRepository userRepository;


    private UserUtil userUtil;

    @Value("${auth.token.type}")
    private String tokenType;

    @Autowired
    private  JwtGenerator jwtGenerator;


    @Autowired
    public void setUserUtil(UserUtil userUtil) {
        this.userUtil = userUtil;
    }

    public AuthUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<JwtData> extractJwtData(String authorizationHeader){

        if (authorizationHeader != null && !authorizationHeader.isEmpty()
                && authorizationHeader.startsWith(tokenType.concat(" "))) {

            String jwt = authorizationHeader.substring(tokenType.length() + 1); // +1 to start with the next word
            String email = jwtGenerator.getUserNameFromJwtToken(jwt);
            return Optional.of(new JwtData(email, jwt));
        }
        return Optional.empty();
    }

    /**
     *
     * @param id User id
     * @return true if the user id in the session is the same @param id or if the user has {{@link RoleType}} ADMIN role
     */
    public boolean isUserGranted(long id){
        UserDetailsImpl userDetails = getUserDetailsSecurityContext();

        return isAdmin() || userDetails.getUserId() == id;
    }

    /**
     * Check if the current user in the Context is an Admin or not
     * @return true if the @Param id is an admin user otherwise false
     */
    public boolean isAdmin(){
        return userUtil.hasRole(getUserDetailsSecurityContext().getUserId(), RoleType.ADMIN);
    }

    public UserDetailsImpl getUserDetailsSecurityContext(){
        return  (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }


}
