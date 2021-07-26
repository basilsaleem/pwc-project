import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {RegistrationComponent} from './registration/registration.component';
import {MatTabsModule} from '@angular/material/tabs';
import {LoginComponent} from './registration/login/login.component';
import {SignupComponent} from './registration/signup/signup.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserPageComponent } from './page/user-page/user-page.component';
import { AdminPageComponent } from './page/admin-page/admin-page.component';
import { NavbarComponent } from './page/navbar/navbar.component';
import { ComplaintFormComponent } from './page/complaint-form/complaint-form.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ManageComplaintComponent } from './page/manage-complaint/manage-complaint.component';
import {AuthInterceptor} from './auth/auth.interceptor';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ComplaintTicketsListComponent } from './page/complaint-tickets-list/complaint-tickets-list.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { ViewComplaintComponent } from './page/view-complaint/view-complaint.component';
import { ManageUsersComponent } from './page/manage-users/manage-users.component';
import { AddUserComponent } from './page/add-user/add-user.component';
import {MatDialogModule} from '@angular/material/dialog';
import {A11yModule} from '@angular/cdk/a11y';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    SignupComponent,
    UserPageComponent,
    AdminPageComponent,
    NavbarComponent,
    ComplaintFormComponent,
    ManageComplaintComponent,
    ComplaintTicketsListComponent,
    ViewComplaintComponent,
    ManageUsersComponent,
    AddUserComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    A11yModule,
    MatExpansionModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    HttpClientModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    NgbModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule

  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
