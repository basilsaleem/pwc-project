import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Role} from '../model/role';
import {pageConfig} from '../page.config';
import {AlertService} from '../../alert/alert.service';
import {Observable, of, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private rolesListener =  new Subject<Role[]>();

  getRolesListener(): Subject<Role[]> {
    return this.rolesListener;
  }
  constructor(private httpClient: HttpClient, private alertService: AlertService) { }


  findAll(): Role[] {
    // tslint:disable-next-line:max-line-length
    const signupEndpoint = pageConfig.APP_ENDPOINT + pageConfig.role.API.VERSION + pageConfig.role.API.FIND_ALL;
    this.httpClient.get<Role[]>(signupEndpoint)
      .subscribe(responseData => {
        this.rolesListener.next(responseData);
      }, error => {
        if (error.status === 409){
          console.log(error);
          this.alertService.errorNotification('E-mail address is reserved  please try another email');
        }
      });
    return [];
  }
}
