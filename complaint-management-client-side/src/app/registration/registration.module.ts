import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {RegistrationComponent} from './registration.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {SimpleGuard} from '../auth/guard/simple.guard';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'registration', },
  {path: 'registration', component: RegistrationComponent, canActivate: [SimpleGuard], children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      }
    ]
  }

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
