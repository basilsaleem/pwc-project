package com.assignment.pwc.complaintmanagement.entity.complaint;


import javax.persistence.*;

@Entity
@Table(name = "complaint_status")
public class ComplaintStatus implements com.assignment.pwc.complaintmanagement.entity.Entity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "status_code")
    private String code;

    @Override
    public long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
