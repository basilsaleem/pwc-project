import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../auth/service/auth.service';
import {UserDataRequest} from '../../auth/userDataRequest';
import {AlertService} from '../../alert/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  constructor(private authService: AuthService, private alert: AlertService) { }

  ngOnInit(): void {
  }

  submitLogin(form: NgForm): void{
    if (form.invalid) {
      return;
    }
    const auth: UserDataRequest = {email: form.value.email, password: form.value.password, role: 'user'};
    this.authService.login(auth);
  }
}
