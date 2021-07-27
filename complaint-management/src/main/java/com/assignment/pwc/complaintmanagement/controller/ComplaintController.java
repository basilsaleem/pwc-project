package com.assignment.pwc.complaintmanagement.controller;

import com.assignment.pwc.complaintmanagement.entity.complaint.ComplaintStatus;
import com.assignment.pwc.complaintmanagement.model.complaint.ComplaintRequestDetails;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface ComplaintController<C> {

    ResponseEntity<?> createComplaint(ComplaintRequestDetails complaintRequestDetails);

    List<C> findAllComplaintsByUserId(long userId);

    ResponseEntity<?> removeComplaintById(long complaintId);

    List<C> findAllComplaints();

    List<ComplaintStatus> findAllComplaintStatues();

    ResponseEntity<?> updateComplaintStatus(ComplaintRequestDetails requestDetails);

    Map<String, List<C>> findAllComplaintsSortedByCode();


    List<C> findAllByComplaintStatus(String statusCode);

    List<C> findAllByEmailText(String text);
}
