package com.assignment.pwc.complaintmanagement.entity.user;

import java.util.Arrays;

public enum RoleType {

    ADMIN("admin"), USER("user");

    private final String roleName;

    RoleType(String roleName){
        this.roleName = roleName;
    }

    public String getRoleName() {
        return roleName;
    }

    public static RoleType findByName(String roleName){
        return Arrays.stream(values()).filter(role -> role.getRoleName().equals(roleName)).findFirst()
                .orElseThrow(() -> new IllegalStateException("Enum type not found"));
    }

}
