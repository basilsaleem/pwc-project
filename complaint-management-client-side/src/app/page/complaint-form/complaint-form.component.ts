import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {ComplaintService} from '../service/complaint.service';
import {ComplaintRequest} from '../service/ComplaintRequest';
import {AuthService} from '../../auth/service/auth.service';

@Component({
  selector: 'app-complaint-form',
  templateUrl: './complaint-form.component.html',
  styleUrls: ['./complaint-form.component.css']
})
export class ComplaintFormComponent implements OnInit {

  constructor(private complaintService: ComplaintService, private authService: AuthService) { }

  ngOnInit(): void {
  }

  onFormSubmit(forms: NgForm): void{
    if (forms.invalid){
      return;
    }
    const userId = this.authService.getUserId();
    const requestData: ComplaintRequest = {message: forms.value.message, subject: forms.value.subject, userId};
    this.complaintService.createComplaint(requestData);

  }

}
