package com.assignment.pwc.complaintmanagement.controller.util;

import com.assignment.pwc.complaintmanagement.entity.complaint.Complaint;
import com.assignment.pwc.complaintmanagement.entity.complaint.ComplaintStatus;
import com.assignment.pwc.complaintmanagement.entity.complaint.ComplaintStatusType;
import com.assignment.pwc.complaintmanagement.entity.user.User;
import com.assignment.pwc.complaintmanagement.exception.EntityNotFoundException;
import com.assignment.pwc.complaintmanagement.model.complaint.ComplaintRequestDetails;
import com.assignment.pwc.complaintmanagement.repo.ComplaintStatusRepository;
import com.assignment.pwc.complaintmanagement.repo.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class ComplaintUtil {


    private final UserRepository userRepository;
    private final ComplaintStatusRepository complaintStatusRepository;

    public ComplaintUtil(ComplaintStatusRepository complaintStatusRepository, UserRepository userRepository){
        this.complaintStatusRepository = complaintStatusRepository;
        this.userRepository = userRepository;
    }

    /**
     *  Create a shallow copy of {{@link Complaint}} from @param complaintRequestDetails
     * @param complaintRequestDetails a Complaint body to be created
     * @return {{@link Complaint}} filled with @param complaintRequestDetails
     */
    public Complaint createComplaintOf(ComplaintRequestDetails complaintRequestDetails){
        Complaint complaint = new Complaint();

        complaint.setSubject(complaintRequestDetails.getSubject());
        complaint.setMessage(complaintRequestDetails.getMessage());

        complaint.setStatusId(complaintStatusRepository
                .findComplaintStatusByCode(ComplaintStatusType.PENDING.getName()).map(ComplaintStatus::getId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Compliant status "+ complaintRequestDetails.getSubject() + " Not found!"))
        );
        complaint.setUserId(userRepository.findById(complaintRequestDetails.getUserId())
                .map(User::getId)
                .orElseThrow(() ->
                        new EntityNotFoundException("User Id "+ complaintRequestDetails.getSubject() + " Not found!")));

        return complaint;
    }
}
