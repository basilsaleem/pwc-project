package com.assignment.pwc.complaintmanagement.controller.complaint;

import com.assignment.pwc.complaintmanagement.controller.ComplaintController;
import com.assignment.pwc.complaintmanagement.controller.util.ComplaintUtil;
import com.assignment.pwc.complaintmanagement.entity.complaint.Complaint;
import com.assignment.pwc.complaintmanagement.entity.complaint.ComplaintStatus;
import com.assignment.pwc.complaintmanagement.model.ApiResponse;
import com.assignment.pwc.complaintmanagement.model.complaint.ComplaintRequestDetails;
import com.assignment.pwc.complaintmanagement.repo.ComplaintRepository;
import com.assignment.pwc.complaintmanagement.repo.ComplaintStatusRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("api/v1")
public class ComplaintControllerImpl<C extends Complaint> implements ComplaintController<C> {

    private final ComplaintUtil complaintUtil;
    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusRepository complaintStatusRepository
            ;

    public ComplaintControllerImpl(ComplaintRepository complaintRepository,
                                   ComplaintUtil complaintUtil,
                                   ComplaintStatusRepository complaintStatusRepository){

        this.complaintRepository = complaintRepository;
        this.complaintUtil = complaintUtil;
        this.complaintStatusRepository = complaintStatusRepository;
    }

    @Override
    @PostMapping("/complaint/create")
    public ResponseEntity<?> createComplaint(@RequestBody ComplaintRequestDetails complaintRequestDetails) {
        complaintRepository.save(complaintUtil.createComplaintOf(complaintRequestDetails));

        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("Created Successfully"));
    }

    @SuppressWarnings("unchecked")
    @Override
    @PreAuthorize("@authUtil.isUserGranted(#userId)")
    @GetMapping("/complaints/user/{userId}")
    public List<C> findAllComplaintsByUserId(@PathVariable("userId") long userId) {
        return (List<C>) complaintRepository.findAllByUserId(userId);
    }

    @Override
    @DeleteMapping("/complaints/remove/{id}")
    public ResponseEntity<?> removeComplaintById(@PathVariable("id") long complaintId) {

        try{
            complaintRepository.deleteById(complaintId);
        }catch(Exception e){
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("Deleted");
    }

    @SuppressWarnings("unchecked")
    @Override
    @PreAuthorize("@authUtil.isAdmin()")
    @GetMapping("/complaints")
    public List<C> findAllComplaints() {
        return (List<C>) complaintRepository.findAll();
    }

    @Override
    @GetMapping("complaint/statues")
    public List<ComplaintStatus> findAllComplaintStatues() {
        return (List<ComplaintStatus>) complaintStatusRepository.findAll();
    }

    @Override
    @PutMapping("complaint/status-update")
    public ResponseEntity<?> updateComplaintStatus(@RequestBody ComplaintRequestDetails requestDetails) {
        complaintRepository.findById(requestDetails.getComplaintId()).ifPresent(complaint -> {
            ComplaintStatus complaintStatus = complaintStatusRepository.findComplaintStatusByCode(requestDetails.getStatusCode()).orElseThrow();
            complaint.setStatusId(complaintStatus.getId());
            this.complaintRepository.save(complaint);
        });
        return ResponseEntity.status(HttpStatus.CREATED).body("Updated successfully");
    }
}
