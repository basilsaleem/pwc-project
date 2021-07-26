package com.assignment.pwc.complaintmanagement.model.auth;

import com.assignment.pwc.complaintmanagement.entity.user.Role;
import com.assignment.pwc.complaintmanagement.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class UserDetailsImpl implements UserDetails {

    private User userEntity;
    private boolean isAccountNonExpired;
    private boolean isAccountNonLocked;
    private boolean isCredentialsNonExpired;
    private boolean isEnabled;

    private UserDetailsImpl(User user, boolean isAccountNonExpired, boolean isAccountNonLocked, boolean isCredentialsNonExpired, boolean isEnabled) {
        this.userEntity = user;
        this.isAccountNonExpired = isAccountNonExpired;
        this.isAccountNonLocked = isAccountNonLocked;
        this.isCredentialsNonExpired = isCredentialsNonExpired;
        this.isEnabled = isEnabled;
    }


    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<Role> roles = userEntity.getRoles();
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }

        return authorities;
    }

    public Collection<String> getRoles() {
        return userEntity.getRoles().stream().map(Role::getName).collect(Collectors.toList());
    }
    @JsonIgnore
    public long getUserId() {
        return userEntity.getId();
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return this.userEntity.getPassword();
    }

    @Override
    @JsonIgnore
    public String getUsername() {
        return this.userEntity.getEmail();
    }

    public User getUserEntity() {
        return userEntity;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return this.isAccountNonExpired;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return this.isAccountNonLocked;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return this.isCredentialsNonExpired;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return this.isEnabled;
    }

    public static class Builder{

        private User user;
        private boolean isAccountNonExpired = true;
        private boolean isAccountNonLocked = true;
        private boolean isCredentialsNonExpired = true;
        private boolean isEnabled = true;

        public Builder(User user){
            this.user = user;
        }
        public Builder setPassword(String password) {
            this.user.setPassword(password);
            return this;
        }

        public Builder setUserName(String username) {
            this.user.setEmail(username);
            return this;
        }

        public Builder setAccountNonExpired(boolean accountNonExpired) {
            isAccountNonExpired = accountNonExpired;
            return this;
        }

        public Builder setAccountNonLocked(boolean accountNonLocked) {
            isAccountNonLocked = accountNonLocked;
            return this;
        }

        public Builder setCredentialsNonExpired(boolean credentialsNonExpired) {
            isCredentialsNonExpired = credentialsNonExpired;
            return this;
        }

        public Builder setEnabled(boolean enabled) {
            isEnabled = enabled;
            return this;
        }

        public UserDetails build(){
            return new UserDetailsImpl(user,
                    isAccountNonExpired,
                    isAccountNonLocked,
                    isCredentialsNonExpired,
                    isEnabled
            );
        }
    }

}
