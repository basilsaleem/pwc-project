import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthGuard} from './auth.guard';

@Injectable({
  providedIn: 'root'
})
export class ChildAuthGuardService implements CanActivateChild{

  constructor(private authGuard: AuthGuard) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authGuard.canActivate(childRoute, state);
  }
}
