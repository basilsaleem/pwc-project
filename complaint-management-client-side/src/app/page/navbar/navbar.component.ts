import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  authListenerSubscription: Subscription;
  userLoggedInListener: Subscription;
  isAuthenticatedUser: boolean;
  userEmail: string;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authListenerSubscription = this.authService.getAuthStatus().subscribe(isAuthenticated => {
      this.isAuthenticatedUser = isAuthenticated;
      if (!this.isAuthenticatedUser){
        this.authService.logout();
      }
    });
    if (this.authService.getUser())
      this.userEmail = this.authService.getUser().email;
    this.userLoggedInListener = this.authService.getUserLoggedInListener().subscribe(user => {
      this.userEmail = user.email;
    });


    this.isAuthenticatedUser = this.authService.IsAuthenticated();

  }

  ngOnDestroy(): void {
    this.authListenerSubscription.unsubscribe();
    this.userLoggedInListener.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  toLoginPage(): void{
    this.router.navigate(['registration/login']);
  }

  toSignupPage(): void{
    this.router.navigate(['registration/signup']);
  }
}
