import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {ComplaintService} from '../service/complaint.service';
import {Complaint} from '../model/complaint';
import {ComplaintStatus} from '../model/complaint.status';
import {MatSelect} from '@angular/material/select';
import {AlertService} from '../../alert/alert.service';
import {AuthService} from '../../auth/service/auth.service';
import {StyleGenerator} from '../style-generator';

@Component({
  selector: 'app-complaint-tickets-list',
  templateUrl: './complaint-tickets-list.component.html',
  styleUrls: ['./complaint-tickets-list.component.css']
})
export class ComplaintTicketsListComponent implements OnInit, OnDestroy {
  constructor(private complaintService: ComplaintService, private alertService: AlertService, private authService: AuthService) {}

  @Input() isUpdatable: false;

  @Input() showSubmitterEmail = false;
  // tslint:disable-next-line:no-input-rename
  @Input('complaints') complaints: Complaint[];

  private complaintSub: Subscription;
  public selectedComplaint: Complaint;

  statues: ComplaintStatus[];
  generateStyle: StyleGenerator = {
    getStyle(code: string): string {
      if (code === 'pending'){
        return '#F7CB73';
      }else if (code === 'resolved'){
        return '#50AE34';
      }else if (code === 'dismissed'){
        return '#df4759';
      }
    }
  };


  ngOnInit(): void {
    this.complaintSub = this.complaintService.getComplaintSubscription()
      .subscribe((complaints: Complaint[]) => {
        this.complaints = complaints;
      });

    this.statues = this.complaintService.getAllComplaintStatus();
    this.complaintService.getComplaintStatusSubscription().subscribe(complaintStatus => {
      this.statues = complaintStatus;
    });
  }

  ngOnDestroy(): void {
  }

  updateStatus(id: number, selectElement: MatSelect): void {
    this.complaintService.updateComplaintStatus(id, selectElement.value);
  }

  isAdmin(): boolean {
    return this.authService.IsAdmin();
  }
}
