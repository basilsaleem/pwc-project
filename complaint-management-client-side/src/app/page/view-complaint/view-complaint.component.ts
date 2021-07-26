import { Component, OnInit } from '@angular/core';
import {ComplaintService} from '../service/complaint.service';
import {AuthService} from '../../auth/service/auth.service';
import {NgForm} from '@angular/forms';
import {ComplaintRequest} from '../service/ComplaintRequest';
import {Complaint} from '../model/complaint';

@Component({
  selector: 'app-view-complaint',
  templateUrl: './view-complaint.component.html',
  styleUrls: ['./view-complaint.component.css']
})
export class ViewComplaintComponent implements OnInit {

  complaints: Complaint[] = [];

  constructor(private complaintService: ComplaintService, private authService: AuthService) { }


  ngOnInit(): void {
    this.complaints = [...this.complaintService.getAllByUserId(this.authService.getUserId())];
  }
}
