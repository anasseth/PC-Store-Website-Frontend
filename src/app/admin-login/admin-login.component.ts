import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../Services/global.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  adminCredentials: any;
  email?: string;
  password?: string;
  newPassword?: string;
  isLogin: boolean = true;
  isChangePassword: boolean = false;

  constructor(public router: Router, public global: GlobalService) { }

  ngOnInit(): void {
    // Getting Admin Credentials
  }

  activeChangePassword() {
    // Switch to Change Password
    this.isChangePassword = true;
    this.isLogin = false;
  }

  // ********** Admin Login **********
  // we first check if the active screen is of login or changePassword
  // if login is active we then check that email and password must not be null else we show error
  // if not null we create a new object and set email in name and password in password proerty
  // after that we post the object to admin Login API. if successfull
  // we route admin to profile page . else error popup

  // if changePassword screen is active , we create a new obj with 3 properties
  // name =  email , password = password and newpassword = newpassword
  // the process of change Password is handled in global Service function However, I will be describing the 
  // logic here. Firstly, we hit the login API to check if the provided old password is correct. 
  // if API response is successfull we move ahead and create a new object and replace the password 
  // property with new password and then hit update password API. Incase of error , we just popup
  // the snackbar with the err from server. 
  login() {
    if (this.isLogin) {
      if ((this.email != undefined || this.email != null) && (this.password != undefined || this.password != null)) {
        var obj2 = {
          name: this.email,
          password: this.password,
        }
        this.global.adminLogin(obj2).subscribe(
          (data: any) => {
            this.openSnackBar("Login Successful", "success")
            this.router.navigate(["/admin"])
            this.global.isLogin = true
            localStorage.setItem("isLogin", JSON.stringify(this.global.isLogin))
          },
          (err: any) => {
            this.openSnackBar("Email or Password is Incorrect", "danger")
          }
        )
      }
      else {
        this.openSnackBar("Email or Password is Incorrect", "danger")
      }
    }
    else if (this.isChangePassword) {
      var obj = {
        name: this.email,
        password: this.password,
        newpassword: this.newPassword
      }
      this.global.updatePassword(obj)
    }
  }

  openSnackBar(message: string, action?: string) {
    // Handling Snackbar From GlobalService Component
    this.global.openSnackBar(message, action)
  }

}
