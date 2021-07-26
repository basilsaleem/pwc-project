
import {ComplaintService} from '../service/complaint.service';
import {Complaint} from '../model/complaint';
import {AuthService} from '../../auth/service/auth.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-manage-complaint',
  templateUrl: './manage-complaint.component.html',
  styleUrls: ['./manage-complaint.component.css']
})
export class ManageComplaintComponent implements OnInit{

  complaints: Complaint[] = [];

  constructor(private complaintService: ComplaintService, private authService: AuthService) { }


  ngOnInit(): void {
    this.complaints = [...this.complaintService.getAll()];
  }

  isAdmin(): boolean {
    return this.authService.IsAdmin();
  }



}
