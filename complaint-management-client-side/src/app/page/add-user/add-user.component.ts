import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Role} from '../model/role';
import {RoleService} from '../service/role.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  roles: Role[];


  constructor(private roleService: RoleService) {
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
}
