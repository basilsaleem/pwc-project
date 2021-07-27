package com.assignment.pwc.complaintmanagement.controller.complaint;

import com.assignment.pwc.complaintmanagement.controller.ComplaintController;
import com.assignment.pwc.complaintmanagement.controller.util.ComplaintUtil;
import com.assignment.pwc.complaintmanagement.entity.complaint.Complaint;
import com.assignment.pwc.complaintmanagement.entity.complaint.ComplaintStatus;
import com.assignment.pwc.complaintmanagement.entity.complaint.ComplaintStatusType;
import com.assignment.pwc.complaintmanagement.entity.user.User;
import com.assignment.pwc.complaintmanagement.model.ApiResponse;
import com.assignment.pwc.complaintmanagement.model.complaint.ComplaintRequestDetails;
import com.assignment.pwc.complaintmanagement.repo.ComplaintJpaRepo;
import com.assignment.pwc.complaintmanagement.repo.ComplaintRepository;
import com.assignment.pwc.complaintmanagement.repo.ComplaintStatusRepository;
import com.assignment.pwc.complaintmanagement.repo.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.*;

@CrossOrigin
@RestController
@RequestMapping("api/v1")
public class ComplaintControllerImpl<C extends Complaint> implements ComplaintController<C> {

    private final ComplaintUtil complaintUtil;
    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusRepository complaintStatusRepository;
    private final ComplaintJpaRepo complaintJpaRepo;
    private final UserRepository userRepository;

    public ComplaintControllerImpl(ComplaintRepository complaintRepository,
                                   ComplaintUtil complaintUtil,
                                   ComplaintStatusRepository complaintStatusRepository,
                                   ComplaintJpaRepo complaintJpaRepo, UserRepository userRepository){

        this.complaintRepository = complaintRepository;
        this.complaintUtil = complaintUtil;
        this.complaintStatusRepository = complaintStatusRepository;
        this.complaintJpaRepo = complaintJpaRepo;
        this.userRepository = userRepository;
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

    @Override
    @GetMapping("/sorted/complaints")
    public Map<String, List<C>> findAllComplaintsSortedByCode() {
        Map<String, List<C>> complaintByStatus = new HashMap<>();
        complaintByStatus.put(ComplaintStatusType.PENDING.getName(), new ArrayList<>());
        complaintByStatus.put(ComplaintStatusType.RESOLVED.getName(), new ArrayList<>());
        complaintByStatus.put(ComplaintStatusType.DISMISSED.getName(), new ArrayList<>());

        List<C> complaint = (List<C>) complaintJpaRepo.findAll(Sort.by(Sort.Order.by("complaintStatus")));
        complaint.stream().forEach(complaintparam -> {
            insertIntoMapList(complaintByStatus, complaintparam.getComplaintStatus().getCode(), complaintparam);
        });

        return complaintByStatus;

    }
    @SuppressWarnings("unchecked")
    @Override
    @GetMapping("/complaints-by-status")
    public List<C> findAllByComplaintStatus(@RequestParam String statusCode) {

        ComplaintStatus complaintStatus =
                this.complaintStatusRepository.
                        findComplaintStatusByCode(statusCode).
                        orElseThrow(() -> new EntityNotFoundException("Not found status"+ statusCode));

        return (List<C>) this.complaintRepository.findAllByComplaintStatus(complaintStatus);
    }

    @Override
    @SuppressWarnings("unchecked")
    @GetMapping("/search/complaints")
    public List<C> findAllByEmailText(@RequestParam String email) {

        if(email == null || email.isEmpty())
            return (List<C>) this.complaintRepository.findAll();

        Optional<User> user = this.userRepository.findByEmail(email);

        if(user.isPresent()){
            return (List<C>) this.complaintRepository.findAllByUserId(user.get().getId());
        }
        return Collections.emptyList();
    }

    private void insertIntoMapList(Map<String, List<C>> map, String key, C item){
        List<C> list = map.get(key);
        list.add(item);
        map.put(key,list);
    }
}
