package com.assignment.pwc.complaintmanagement.repo;

import com.assignment.pwc.complaintmanagement.entity.complaint.Complaint;
import com.assignment.pwc.complaintmanagement.entity.complaint.ComplaintStatus;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends CrudRepository<Complaint, Long> {
    List<Complaint> findAllByUserId(Long userId);
    List<Complaint> findAllByComplaintStatus(ComplaintStatus complaintStatus);
}
