import { Component, OnInit, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../Services/global.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  adminCredentials: any;
  email?: string;
  username?: string;
  password?: string;
  newPassword?: string;
  isLogin: boolean = true;
  isChangePassword: boolean = false;
  isSignUp: boolean = false;

  constructor(public router: Router, public global: GlobalService) { }

  ngOnInit(): void {

    // getting user token from localStorage
    var token = localStorage.getItem("token")
    // if token is undefined or null
    if (token == undefined || token == null) {
    }
    else {
    // token is already their , route user to dashboard
      this.router.navigate(['/user-dashboard'])
    }
  }

  // ******** LogIn/Signup/ForgetPassword Screen ********* 

  // All 3 Below Functions Handles the screen switching between
  // LogIn/Signup/ForgetPassword. As the name of each function indicates
  // it is used for the required purpose 
  // else.g activeLogin means show login screen and hide rest of the screens

  activeChangePassword() {
    // Switching to Change Password Screen
    this.isChangePassword = true; // Setting Forget Password Screen to active
    this.isLogin = false; // setting Login Screen to hide
    this.isSignUp = false; // setting Signup screen to hide
  }

  activeLogIn() {
    // Switching to Login Screen
    this.isChangePassword = false; // Setting Forget Password Screen to hide
    this.isLogin = true; // setting Login Screen to active
    this.isSignUp = false; // setting Signup screen to hide
  }

  activeSignUp() {
    // Switching to SignUp Screen
    this.isChangePassword = false; // Setting Forget Password Screen to hide
    this.isLogin = false; // setting Login Screen to hide
    this.isSignUp = true; // setting Signup screen to active
  }
  // 


  // ***************** login *******************
  // This is the main function that handles all operation
  // if login screen is active, we call userLogin function
  // if Forget Password Screen is active, we call updatePassword function
  // if SignUp screen is active, we call registerUser function
  login() {
    // if isLogin flag is true 
    if (this.isLogin) {
      if ((this.username != undefined || this.username != null) && (this.password != undefined || this.password != null)) {
        this.userLogin()
      }
      else {
        this.global.openSnackBar("Email or Password is Empty")
      }
    }
    else if (this.isChangePassword) {
      this.updatePassword()
    }
    else if (this.isSignUp) {
      if ((this.email != undefined || this.email != null) && (this.password != undefined || this.password != null)) {
        this.registerUser()
      }
      else {
        this.global.openSnackBar("Email or Password is Empty")
      }
    }
  }

  // ***************** Update Password ***************************
  // Update Password Functions Handles
  // user action to change password
  // in this funcion we first hit login API
  // with old username and password . If token is returned successfully. we then hit
  // update password API with username and new password and in this way password is updated.
  updatePassword() {
    // Creating an object with username and password
    var userData = {
      username: this.username,
      password: this.password
    }
    // first calling Login API to receive token if old username
    // and password is correct
    this.global.userLogin(userData).subscribe((result) => {
      localStorage.setItem("token", result.token)
    },
      (err) => {
        console.log(err)
        // Incase of error , show popup on incorrect old password
        this.global.openSnackBar("Old Password Incorrect !")
      }, 
      () => {
        // if old password and username is correct
        // call update password API and post new password
        userData.password = this.newPassword
        this.global.updateUserPassword(userData).subscribe((result) => {
          this.global.openSnackBar("Password Updated !", "success")
        },
          (err) => {
            this.global.openSnackBar("Password Cannot Be Updated ! Try Again Later")
          });
      }
    );
  }

  // **************** Register User *****************
  // Registeration process is simple , we just hit API with user name
  // email and password. if user is registered successfull we show success popup 
  // if operation is failed we show error popup (snackbar)
  registerUser(): void {
    // Creating an object with username, password & email
    var userData = {
      username: this.username,
      email: this.email,
      password: this.password
    }
    // Posting the userData to register user 
    this.global.userRegistration(userData).subscribe((result) => {
      this.global.openSnackBar("Registration Completed", "success")
    },
      (err) => {
        this.global.openSnackBar("Cannot Create Account Right Now ! Try Again Later")
      });
  }

  // ***************** SignIn/LogIn User  *****************
  // this function handles the login action
  // we first create an object with username and password
  // and post on user login API. if result is returned successfully.
  // we store token and user information in localstorage and then route
  // to dashboard area and then success popup is shown
  userLogin(): void {
    // Creating an object with username and password
    var userData: any = {
      username: this.username,
      password: this.password
    }
    // Posting the userData to get token if username and password is correct
    this.global.userLogin(userData).subscribe((result) => {
      userData.email = result.user.email
      // Setting user data in localStorage 
      localStorage.setItem("user", JSON.stringify(userData))
      // Setting token in localStroage
      localStorage.setItem("token", result.token)
      // After Successfully Login, Route to Dashboard
      this.router.navigate(["/user-dashboard"])
      this.global.openSnackBar("Login Successfully", "success")
    },
      (err) => {
        console.log(err)
        this.global.openSnackBar(err)
      });
  }
}
