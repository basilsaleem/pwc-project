package com.assignment.pwc.complaintmanagement.entity.complaint;

import com.assignment.pwc.complaintmanagement.entity.user.User;

import javax.persistence.*;

@Entity
@Table(name = "complaint")
public class Complaint implements com.assignment.pwc.complaintmanagement.entity.Entity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "message")
    private String message;

    @Column(name = "user_id")
    private long userId;

    @Column(name = "status_id")
    private long statusId;

    @Column(name = "subject")
    private String subject;
    @OneToOne
    @JoinColumn(name = "status_id", referencedColumnName = "id" , insertable=false, updatable=false)
    private ComplaintStatus complaintStatus;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id" , insertable=false, updatable=false)
    private User user;

    @Override
    public long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String complaintBody) {
        this.message = complaintBody;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getStatusId() {
        return statusId;
    }

    public void setStatusId(long statusId) {
        this.statusId = statusId;
    }

    public ComplaintStatus getComplaintStatus() {
        return complaintStatus;
    }

    public User getUser() {
        return user;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getSubject() {
        return subject;
    }
}
