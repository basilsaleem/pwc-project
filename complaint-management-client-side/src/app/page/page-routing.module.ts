import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {RegistrationComponent} from '../registration/registration.component';
import {LoginComponent} from '../registration/login/login.component';
import {SignupComponent} from '../registration/signup/signup.component';
import {UserPageComponent} from './user-page/user-page.component';
import {AdminPageComponent} from './admin-page/admin-page.component';
import {ComplaintFormComponent} from './complaint-form/complaint-form.component';
import {ManageComplaintComponent} from './manage-complaint/manage-complaint.component';
import {AuthGuard} from '../auth/guard/auth.guard';
import {ChildAuthGuardService} from '../auth/guard/child-auth-guard.service';
import {AdminGuard} from '../auth/guard/admin-guard.service';
import {ViewComplaintComponent} from './view-complaint/view-complaint.component';
import {ManageUsersComponent} from './manage-users/manage-users.component';
import {SimpleGuard} from '../auth/guard/simple.guard';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'registration' },
  {
    path: 'user',
    component: UserPageComponent, children: [
      {
        path: 'file-complaint',
        component: ComplaintFormComponent
      }, {
        path: 'view-complaint',
        component: ViewComplaintComponent
      },
      {
        path: '**',
        component: ViewComplaintComponent
      }]
  },
  {
    path: 'admin', component: AdminPageComponent, canActivate: [AdminGuard], children: [{
      path: 'manage-complaint',
      component: ManageComplaintComponent
    },
      {
        path: 'manage-users', component: ManageUsersComponent, canActivate: [AdminGuard]
      },
      {
        path: '**', component: ManageUsersComponent, canActivate: [AdminGuard]
      }
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: 'registration' },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class PageRoutingModule { }
