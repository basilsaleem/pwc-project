import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../auth/service/auth.service';
import {AuthDataRequest} from '../../auth/authDataRequest';
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
    const auth: AuthDataRequest = {email: form.value.email, password: form.value.password};
    this.authService.login(auth);
  }
}
