import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../auth/service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  submitSignup(forms: NgForm): void{
    if (forms.invalid){
      return;
    }
    const authData = {email: forms.value.email, password: forms.value.password};
    this.authService.createUser(authData);
  }
}
