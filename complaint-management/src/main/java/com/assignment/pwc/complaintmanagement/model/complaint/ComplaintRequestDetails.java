package com.assignment.pwc.complaintmanagement.model.complaint;

import javax.validation.constraints.NotNull;

public class ComplaintRequestDetails {

    @NotNull
    private Long userId;
    @NotNull
    private String message;
    @NotNull
    private String subject;

    private long complaintId;

    private String statusCode;

    public ComplaintRequestDetails(Long userId, String message, String subject) {
        this.userId = userId;
        this.message = message;
        this.subject = subject;
    }


    public void setComplaintId(long complaintId) {
        this.complaintId = complaintId;
    }

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

    public long getComplaintId() {
        return complaintId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getMessage() {
        return message;
    }

    public String getSubject() {
        return subject;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setSubject(String status) {
        this.subject = status;
    }
}
