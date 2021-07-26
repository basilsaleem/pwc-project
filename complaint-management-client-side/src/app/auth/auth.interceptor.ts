import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from './service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.authService.getAccessToke()){
      const accessToken = 'Bearer ' + this.authService.getAccessToke();
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', accessToken),
      });
      return next.handle(authRequest);
    }

    return next.handle(request);
  }
}
