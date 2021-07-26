import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ComplaintService} from '../service/complaint.service';
import {Complaint} from '../model/complaint';
import {ComplaintStatus} from '../model/complaint.status';
import {NgForm} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {AlertService} from '../../alert/alert.service';

@Component({
  selector: 'app-complaint-tickets-list',
  templateUrl: './complaint-tickets-list.component.html',
  styleUrls: ['./complaint-tickets-list.component.css']
})
export class ComplaintTicketsListComponent implements OnInit, OnDestroy {

  @Input() isUpdatable: false;
  constructor(private complaintService: ComplaintService, private alertService: AlertService) {}

  // tslint:disable-next-line:no-input-rename
  @Input('complaints') complaints: Complaint[];

  private complaintSub: Subscription;
  public selectedComplaint: Complaint;

  statues: ComplaintStatus[];


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
}
