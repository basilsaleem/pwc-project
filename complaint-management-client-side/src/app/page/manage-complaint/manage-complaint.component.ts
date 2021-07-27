
import {ComplaintService} from '../service/complaint.service';
import {Complaint} from '../model/complaint';
import {AuthService} from '../../auth/service/auth.service';
import {Component, Input, OnInit} from '@angular/core';
import {ComplaintStatus} from '../model/complaint.status';
import {MatSelectChange} from '@angular/material/select';
import {ComplaintStatusComponent} from '../complaint-status/complaint-status.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-manage-complaint',
  templateUrl: './manage-complaint.component.html',
  styleUrls: ['./manage-complaint.component.css']
})
export class ManageComplaintComponent implements OnInit{

  complaints: Complaint[] = [];
  complaint: ComplaintStatus[];

  @Input() statusFilter;
  @Input() statusSelectionEvent: MatSelectChange;
  public statues: ComplaintStatus[];
  private complaintSub: Subscription;

  constructor(private complaintService: ComplaintService, private authService: AuthService) {
    this.statues = this.complaintService.getAllComplaintStatus();
    this.complaintService.getComplaintStatusSubscription().subscribe((complaintStatus: ComplaintStatus[]) => {
      // tslint:disable-next-line:variable-name
      const any: ComplaintStatus = {id: -1, code: 'Any'};
      this.statues = [];
      this.statues.push(any);
      this.statues.push(...complaintStatus);
    });
  }


  ngOnInit(): void {
    this.complaintSub = this.complaintService.getComplaintSubscription().subscribe(complaints => {
      this.complaints = [...complaints];
    });
  }

  isAdmin(): boolean {
    return this.authService.IsAdmin();
  }

  // tslint:disable-next-line:typedef
  handleOnStatusSelectionEvent($event: any){
    if ($event && $event.value && $event.value !== 'Any'){
      this.complaintService.getAllByCode($event.value);
    }else{
      this.complaintService.getAll();
    }
  }

  emailChangeListener($event: any): void {
    if ($event && $event.value){
      this.complaintService.getAllByEmail($event.value);
    }else{
      this.complaintService.getAll();
    }

  }





}
