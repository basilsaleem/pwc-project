import { NgModule } from '@angular/core';
import {RegistrationRoutingModule} from './registration/registration.module';
import {RouterModule, Routes} from '@angular/router';
import {PageRoutingModule} from './page/page-routing.module';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login'}
];
@NgModule({
  imports: [RegistrationRoutingModule, RouterModule.forRoot(routes)],
  exports: [RegistrationRoutingModule, RouterModule, PageRoutingModule]
})
export class AppRoutingModule { }
