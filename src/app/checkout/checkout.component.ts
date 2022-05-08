import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../Services/global.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { StripeService, StripeCardComponent } from "ngx-stripe";
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from "@stripe/stripe-js";
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('myModal') myModal: any;
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

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
  paypal?: boolean = false;
  stripe?: boolean = false;
  status: string = "Pending";
  registeredUserData: any;

  action: boolean = true;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  addExtraClass: boolean = true;

  public payPalConfig?: IPayPalConfig;
  totalBilling: string = '0';
  showPaymentDailog: boolean = false;
  closeResult = '';

  elementsOptions: StripeElementsOptions = {
    locale: "en"
  };

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: "40px",
        fontWeight: "300",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: "18px",
        "::placeholder": { color: "#CFD7E0" }
      }
    }
  };

  constructor(
    private spinner: NgxSpinnerService,
    public router: Router,
    public global: GlobalService,
    private stripeService: StripeService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    // Configuring Paypal Payment Dailog, Based on Client ID
    this.initConfig();
    // Getting Order Data from Local Storage 
    // (Saving in Local Storage so that data can be accessible incase of page load)
    var orderData: any = localStorage.getItem('orderData');
    this.orderData = JSON.parse(orderData)
    console.log(this.orderData)

    // Getting Token From LocalStorage
    var token = localStorage.getItem("token")
    // If token is undefined or null
    // Route the user to login Page
    if (token == undefined || token == null) {
      this.global.openSnackBar("Please Login Before Placing an Order");
      this.router.navigate(['/user-login'])
    }
    else {
      // if token is available
      // setting user data in component properties
      var userData: any = localStorage.getItem("user")
      userData = JSON.parse(userData)
      this.firstName = userData.username;
      this.email = userData.email;
      this.registeredUserData = {
        name: userData.username,
        email: userData.email
      }
    }
    console.log(userData)
  }

  // *********************************************
  // ************** Payment Checkbox *****************
  // *********************************************

  // We just change boolean properties 
  // based on the payment radio button clicked
  selectCreditCard() {
    // If CreditCard is selected set all other payment option 
    // to false
    this.creditCard = true;
    this.paypal = false
    this.stripe = false
  }

  selectPaypal() {
    // If Paypal is selected set all other payment option 
    // to false
    this.creditCard = false;
    this.paypal = true;
    this.stripe = false;
  }
  selectStripe() {
    // If StripeF is selected set all other payment option 
    // to false
    this.creditCard = false;
    this.paypal = false;
    this.stripe = true;
  }
  // *********************************************
  // *********************************************

  PaymentProcess(content?: any) {
    // Main Payment Function
    // Step 1: Finalize Data First 
    this.finalizeData();
    if (this.paypal) {
      // If paypal payment method
      // Open paypal dailog 
      this.open(content);
    }
    else if (this.stripe) {
      // If Stripe is active, finalize billing with stripe Function
      this.stripePayment();
    }
    else {
      // if credit card payment is selected
      // post data to API only
      this.spinner.show()
      this.finalizeBooking();
    }
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

  // ********** Finalize Data ************
  // This function only gather data from indiviual varaible and
  // add them in orderData object. For payment, if
  // creditCart variable is true, we just call the finalizeBooking Function
  // that post data directly on the server
  // if Paypal variable is true, we open paypal popup, after payment is successfull from
  // paypal we call finalizeBooking function in onApprove() (initConfig)
  // if Stripe variable is true, we call stripe API, after token is received from
  // stripe we call finalizeBooking function.
    
  finalizeData() {
    // Total Billing setted to discounted_price
    var totalBilling = this.orderData.discounted_price
    // Setting total bill property to string (string required by Paypal)
    this.totalBilling = totalBilling.toString()

    // Setting form data in orderData object
    this.orderData.firstName = this.firstName
    this.orderData.lastName = this.lastName
    this.orderData.number = this.phoneNumber
    this.orderData.email = this.email
    this.orderData.orderDate = new Date();
    this.orderData.address = this.address
    this.orderData.registeredUserData = this.registeredUserData
    // if paypal is true
    if (this.paypal) {
      //set paypal payment method true in orderData object
      this.orderData.paypal = true
    }
    // if Stripe is true
    else if (this.stripe) {
      //set Stripe payment method true in orderData object
      this.orderData.stripe = true
    }
    else {
      // else set the default case to creditcard payemnt
      this.orderData.creditCard = true
      this.orderData.creditCardNumber = this.creditCardNumber
    }
    // set initial order status to pending
    this.orderData.status = "Pending"
  }

  // *********** Finalize Booking Function ***********
  // This is the final function in the list
  // That post order Data
  // if operation is successfull, We show success popup and after 4.2 second 
  // and after that we route to "/shop".
  // Incase of error we just show error popup
  finalizeBooking() {
    console.log(JSON.stringify(this.orderData, undefined, 2))
    // Posting orderData object 
    this.global.postOrderData(this.orderData).subscribe(
      (data) => {
        this.spinner.hide()
        // After successfully posting data on API
        // Show Success Popup
        this.openSnackBar("Thanks For Purchasing, Your Order Has Been Confirmed !", "success")
        setTimeout(() => {
          // Route to shop Page
          this.router.navigate(["/shop"])
        }, 4200);
        console.log(data)
      }, (err) => {
        // Incase of error , hide popup
        this.spinner.hide()
        // show error message
        this.openSnackBar("Error ! Your Order Cannot Be Confirmed At the moment. Please Try Again Later.", "danger")
        console.log(err)
      }
    )
  }

  openSnackBar(message: any, action?: string) {
    this.global.openSnackBar(message, action)
  }


  // *********** Paypal Configuration *************
  // This function is provided by ngx-paypal
  // Only a little modification is needed to be done
  // On Approve , you have to call finalize booking API.
  // This makes sure that when payment procedur is complete from Paypal end 
  // the on Approve function call our finalize booking method to post data on 
  // server.
  private initConfig(): void {
    // Paypal Config Method
    this.payPalConfig = {
      clientId: "27oJa8EVZwqIYeaW-Je2it8H8VxDtTXs1bTLISChtWiwJ_AgmM0eH6pPEh9dbjsZfCRJW",
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: this.totalBilling,
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: this.totalBilling
                  }
                }
              },
              items: [
                {
                  name: "Booking For Marina Spot",
                  quantity: '1',
                  category: "DIGITAL_GOODS",
                  unit_amount: {
                    currency_code: "USD",
                    value: this.totalBilling
                  }
                }
              ]
            }
          ]
        },
      advanced: {
        commit: "true"
      },
      style: {
        label: "paypal",
        layout: "vertical"
      },
      onApprove: (data, actions) => {
        console.log(
          "onApprove - transaction was approved, but not authorized",
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            "onApprove - you can get full order details inside onApprove: ",
            details
          );
          // Uncomment this line before testing payment method and moving for deployment.
          // this.finalizeBooking()
        });
      },
      onClientAuthorization: data => {
        console.log(
          "onClientAuthorization - you should probably inform your server about completed transaction at this point",
          data
        );
      },
      onCancel: (data, actions) => {
        console.log("OnCancel", data, actions);
      },
      onError: err => {
        console.log("OnError", err);
      },
      onClick: (data, actions) => {
        console.log("onClick", data, actions);
      }
    };
  }

  // *********** Popup Opening Function ************
  // This function is provided by Modal Library
  open(content: any) {
    this.showPaymentDailog = true;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // *********** Popup Closing Function ************
  // This function is provided by Modal Library
  private getDismissReason(reason: any): string {
    // Modal Closing Function from Bootstrap ngModal
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // ************* Stripe Payment Function *****************
  // This function is really simple. We first get User firstname
  // and set it in name variable. then using Stripe API. 
  // Card element contain user card information and name parameter contain
  // firstname. If Stripe API return token successfully . We call our finalize booking function
  // else we show error message
  stripePayment(): void {
    // Stripe Payment Handling Function
    var name: any = this.firstName
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          // Use the token
          console.log(result.token.id);
          this.finalizeBooking();
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
          this.openSnackBar(result.error.message, "danger")
        }
      });
  }

}
