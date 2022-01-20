import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../Services/global.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  orderData: any
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  creditCard?: boolean;
  creditCardNumber?: string;
  paypal?: boolean;
  status: string = "Pending";

  constructor(public router: Router, public global:GlobalService) { }

  ngOnInit(): void {
    var orderData: any = localStorage.getItem('orderData');
    this.orderData = JSON.parse(orderData)
    console.log(this.orderData)
  }

  selectCreditCard() {
    this.creditCard = true;
    this.paypal = false
  }

  selectPaypal() {
    this.creditCard = false;
    this.paypal = true;
  }

  switchTab() {
    if (this.tab1 == true) {
      this.tab2 = true;
      this.tab1 = false;
      this.tab3 = false;
    }
    else if (this.tab2 == true) {
      this.tab2 = false;
      this.tab1 = false;
      this.tab3 = true;
    }
  }

  finishOrder() {
    this.orderData.firstName = this.firstName
    this.orderData.lastName = this.lastName
    this.orderData.number = this.phoneNumber
    this.orderData.email = this.email
    this.orderData.orderDate = new Date();
    this.orderData.address = this.address
    if (this.creditCard) {
      this.orderData.creditCard = true
      this.orderData.creditCardNumber = this.creditCardNumber
    }
    else {
      this.orderData.paypal = true
    }
    this.orderData.status = "Pending"
    console.log(JSON.stringify(this.orderData, undefined, 2))

    this.global.postOrderData(this.orderData).subscribe(
      (data) => {
        console.log(data)
      }, (err) => {
        console.log(err)
      }
    )

    console.log(this.orderData)
    alert("Thanks For Shopping, Your Order Will be Delivered Soon !")
    this.router.navigate(["/shop"])
  }

}
