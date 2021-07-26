package com.assignment.pwc.complaintmanagement.entity.complaint;

public enum ComplaintStatusType {
    RESOLVED("resolved"),
    PENDING("pending"),
    DISMISSED("dismissed");

    private final String name;

    ComplaintStatusType(String name){
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
