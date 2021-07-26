import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  authListenerSubscription: Subscription;
  isAuthenticatedUser: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authListenerSubscription = this.authService.getAuthStatus().subscribe(isAuthenticated => {
      this.isAuthenticatedUser = isAuthenticated;
    });
    this.isAuthenticatedUser = this.authService.IsAuthenticated();
  }

  ngOnDestroy(): void {
    this.authListenerSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
