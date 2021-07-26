package com.assignment.pwc.complaintmanagement.entity.user;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
public class Role implements com.assignment.pwc.complaintmanagement.entity.Entity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank
    @Column(name = "role_name")
    private String name;

    @Override
    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setId(long id) {
        this.id = id;
    }

}
