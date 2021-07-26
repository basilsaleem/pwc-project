package com.assignment.pwc.complaintmanagement.controller.role;

import com.assignment.pwc.complaintmanagement.controller.RoleController;
import com.assignment.pwc.complaintmanagement.entity.user.Role;
import com.assignment.pwc.complaintmanagement.repo.RoleRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/v1")
public class RoleControllerImpl implements RoleController {

    private final RoleRepository roleRepository;

    public RoleControllerImpl(RoleRepository roleRepository){
        this.roleRepository = roleRepository;
    }
    @Override
    @PreAuthorize("@authUtil.isAdmin()")
    @GetMapping("/roles")
    public List<Role> findAll() {
        return (List<Role>) this.roleRepository.findAll();
    }
}
