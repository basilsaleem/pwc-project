import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ComplaintRequest} from './ComplaintRequest';
import {pageConfig} from '../../page/page.config';
import {AlertService} from '../../alert/alert.service';
import {Complaint} from '../model/complaint';
import {Subject} from 'rxjs';
import {ComplaintStatus} from '../model/complaint.status';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  complaintSubscription = new Subject<Complaint[]>();
  complaintStatusSubscription = new Subject<ComplaintStatus[]>();

  getComplaintSubscription(): Subject<Complaint[]>{
    return this.complaintSubscription;
  }

  getComplaintStatusSubscription(): Subject<ComplaintStatus[]> {
    return this.complaintStatusSubscription;
  }
  constructor(private httpClient: HttpClient, private alertService: AlertService) { }

  createComplaint(complaintData: ComplaintRequest): void{
    const loginEndPoint = pageConfig.APP_ENDPOINT + pageConfig.complaint.API.VERSION + pageConfig.complaint.API.CREATE_COMPLAINT;
    this.httpClient.post(loginEndPoint, complaintData)
      .subscribe(responseData => {
        console.log(responseData);
        this.alertService.successNotification('Send Successfully');
      }, error => {
        console.log(error);
        this.alertService.errorNotification('Failed to send complaint');
      });
  }

  getAllByUserId(userId: number): Complaint[] {
    // tslint:disable-next-line:max-line-length
    const getAllUri = pageConfig.APP_ENDPOINT + pageConfig.complaint.API.VERSION + pageConfig.complaint.API.FIND_COMPLAINTS_BY_USER_ID + userId;
    this.httpClient.get<Complaint[]>(getAllUri).subscribe(responseData => {
        console.log(responseData);
        this.complaintSubscription.next(responseData);
        return responseData;
      }, error => {console.log(error); });
    return [];
  }

  getAll(): Complaint[] {
    const getAllUri = pageConfig.APP_ENDPOINT + pageConfig.complaint.API.VERSION + pageConfig.complaint.API.FIND_ALL;
    this.httpClient.get<Complaint[]>(getAllUri).subscribe(responseData => {
      console.log(responseData);
      this.complaintSubscription.next(responseData);
      return responseData;
    }, error => {
      console.log(error);
    });
    return [];
  }

  getAllComplaintStatus(): ComplaintStatus[] {
    const getAllUri = pageConfig.APP_ENDPOINT + pageConfig.complaint.API.VERSION + pageConfig.complaint.API.FIND_ALL_COMPLAINT_STATUES;
    this.httpClient.get<ComplaintStatus[]>(getAllUri).subscribe(responseData => {
      this.complaintStatusSubscription.next(responseData);
    }, error => {
      console.log(error);
    });
    return [];
  }

  updateComplaintStatus(complaintId: number, statusCode: string): void {
    const getAllUri = pageConfig.APP_ENDPOINT + pageConfig.complaint.API.VERSION + pageConfig.complaint.API.UPDATE_COMPLAINT_STATUS;
    this.httpClient.put(getAllUri, {complaintId, statusCode},{
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    }).subscribe(responseData => {
      if (responseData){
        this.alertService.successNotification('Update successfully');
      }
    }, error => {
      console.log(error);
    });
  }
}
