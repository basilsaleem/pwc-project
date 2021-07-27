import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthService} from './service/auth.service';
import {AlertService} from '../alert/alert.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private alertService: AlertService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].indexOf(err.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        this.authService.logout();
        this.alertService.errorNotification('Session expired');
      }else  if ([ 500].indexOf(err.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        this.alertService.errorNotification('Internal Error');
      }else if ([ 409].indexOf(err.status) !== -1){
        this.alertService.errorNotification('Duplicate Email');
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
