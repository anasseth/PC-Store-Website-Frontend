import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../Services/global.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  userData: any;
  orderData: any;
  productData: any;
  totalPurchase: any = 0;
  totalDiscount: any = 0;
  USDRates: any = 0;
  GBPRates: any = 0.765254;
  constructor(public global: GlobalService, public router: Router) { }

  ngOnInit(): void {

    // ************** On Load Process *****************
    // First we check if token exist or not so that if it is missing we route 
    // user to login page. if token exist we get user information from localstorage
    // and then set it into properties
    // After that we just Currency Conversion API to get latest rate
    // for USD to GBP.
    // After Calling Currency API, We get order data using GET API
    // We then calculate Total Purchase Amount & Total Discount Amount

    // On Page Load We Just Check If The Token Is Available. In Short If User is Signed In or Not
    var token = localStorage.getItem("token")
    if (token == undefined || token == null) {
      // if token not founded. Take User to Login Screen
      this.global.openSnackBar("Please Login !");
      this.router.navigate(['/user-login'])
    }
    else {
      // Else Take User Details From LocalStorage and Set it to Username & Email
      var userData: any = localStorage.getItem("user")
      userData = JSON.parse(userData)
      this.userData = {
        username: userData.username,
        email: userData.email
      }
    }

    // Getting Currency Rates From an Open API
    // Optional
    this.global.getCurrencyUpdate().subscribe(
      (data: any) => {
        this.GBPRates = (1 / data.rates.GBP).toFixed(3)
        this.USDRates = (data.rates.GBP / 1).toFixed(3)
      }
    )

    // Get User Order Data.
    // First Calling API to get all order Data
    this.global.getOrderData().subscribe(
      (data) => {
        console.log(data)
        // We then filter orders of this user by matching his/her email with the one we have in our localStorage
        this.orderData = data.filter((x: any) => x.email == this.userData.email)
        for (var i = 0; i < this.orderData.length; i++) {
          // Then Caluclating Total Amount of Purchase By User
          this.totalPurchase = this.totalPurchase + Number(this.orderData[i].discounted_price * this.orderData[i].qty)
          // Then Calculating Discount User Achieved (original_price minus discounted_price)
          this.totalDiscount = this.totalDiscount + Number(this.orderData[i].original_price * this.orderData[i].qty)
        }
        // Rounding of the amounts to 2 decimal places
        this.totalDiscount = this.totalDiscount - this.totalPurchase
        this.totalDiscount = this.totalDiscount.toFixed(2)
        this.totalPurchase = this.totalPurchase.toFixed(2)
      }
    )
  }

  //************** Get Order Data ******************
  // This function return order data based on status : either Delivered / Pending
  // used with ngFor 
  getPreviousOrders(status?: string) {
    // This function returns order based on status Delivered / Pending
    return this.orderData.filter((x: any) => x.status == status && x.registeredUserData.email == this.userData.email)
  }

 //*************** LogOut ****************
 // On logout, we clear localStorage and route user to shop page
  logOut() {
    localStorage.clear()
    this.router.navigate(["/"])
  }
}
