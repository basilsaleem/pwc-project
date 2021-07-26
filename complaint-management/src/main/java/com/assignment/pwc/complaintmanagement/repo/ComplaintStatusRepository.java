package com.assignment.pwc.complaintmanagement.repo;

import com.assignment.pwc.complaintmanagement.entity.complaint.ComplaintStatus;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ComplaintStatusRepository extends CrudRepository<ComplaintStatus, Long> {
    Optional<ComplaintStatus> findComplaintStatusByCode(String statusCode);
}
