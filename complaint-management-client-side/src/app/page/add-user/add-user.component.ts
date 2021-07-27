import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Role} from '../model/role';
import {RoleService} from '../service/role.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AuthService} from '../../auth/service/auth.service';
import {UserDataRequest} from '../../auth/userDataRequest';
import {AlertService} from '../../alert/alert.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, OnDestroy {
  roles: Role[] = [];
  form: FormGroup;
  email = '';
  password = '';
  role = '';

  creationSubscriptionListener: Subscription;

  constructor(private roleService: RoleService,
              private dialog: MatDialogRef<AddUserComponent>,
              @Inject(MAT_DIALOG_DATA) data, fb: FormBuilder,
              private authService: AuthService,
              private alertService: AlertService) {
    this.form = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      role: new FormControl()
    });
    this.form = fb.group({
      email: this.email ,
      password: [this.password, [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      role: [this.role, [Validators.required]]
    });

  }

  ngOnInit(): void {
    this.roleService.findAll();
    this.roleService.getRolesListener().subscribe(data => {
      this.roles = [...data];
    }, error => {
      console.log(error);
    });
  }


  onAddUser(formElement: NgForm): void {
    const authData = {email: formElement.value.email, password: formElement.value.password};
  }

  onClose(){
    this.dialog.close(true);
  }

  submit(): void {
    if (this.form.invalid){
      return;
    }
    const userData: UserDataRequest = {email: this.form.value.email, password: this.form.value.password, role: 'user'};

    this.authService.createUser(userData);

    this.creationSubscriptionListener = this.authService.getUserCreationListener().subscribe(isCreated => {
      if (isCreated){
        this.dialog.close(true);
        this.alertService.errorNotification('Created successfully');
      }else{
        this.alertService.errorNotification('E-mail address is reserved please try another email');
      }
    });
  }
  ngOnDestroy() {
    this.creationSubscriptionListener.unsubscribe();
  }
}
