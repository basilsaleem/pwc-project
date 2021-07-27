package com.assignment.pwc.complaintmanagement.repo;

import com.assignment.pwc.complaintmanagement.entity.complaint.Complaint;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ComplaintJpaRepo extends PagingAndSortingRepository<Complaint, Long> {
}
