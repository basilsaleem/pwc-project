import {ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Complaint} from '../model/complaint';
import {ComplaintService} from '../service/complaint.service';
import {ComplaintStatus} from '../model/complaint.status';
import {MatSelectChange} from '@angular/material/select';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-complaint-status',
  templateUrl: './complaint-status.component.html',
  styleUrls: ['./complaint-status.component.css']
})
export class ComplaintStatusComponent implements OnInit {

  constructor(private complaintService: ComplaintService) { }

  // tslint:disable-next-line:no-input-rename
  @Input('complaints') complaints: Complaint[];


  @Input() fakeInput: string;

  statues: ComplaintStatus[];

  @Output() statusEvent = new EventEmitter<any>();


  @HostListener('selectionChange') me(eventData: MatSelectChange) {

  }



  ngOnInit(): void {
    this.statues = this.complaintService.getAllComplaintStatus();
    this.complaintService.getComplaintStatusSubscription().subscribe(complaintStatus => {
      this.statues = [];
      const anyStatus: ComplaintStatus = {id: -1, code: 'Any'};
      this.statues.push(anyStatus);
      this.statues.push(...complaintStatus);
    });
  }

  public fireSelectionChanged($event: any): void {
    console.log(this.statusEvent);
  }

}
