import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../Services/global.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  qty: any = 1;
  isLogin: boolean = false;
  message: string = "";
  rating: any = 5;
  username: string = "";
  email: string = "";

  constructor(public router: Router, public global: GlobalService) { }

  ngOnInit(): void {
    if (this.global.selectedProduct == undefined || this.global.selectedProduct == null) {
      this.router.navigate(['/'])
    }
    // On Page Load We Just Check If The Token Is Available. In Short If User is Signed In or Not
    var token = localStorage.getItem("token")
    if (token == undefined || token == null) {
      // if not we set isLogin to false
      this.isLogin = false
    }
    else {
      // else we set login flag to true
      this.isLogin = true
      // then retrieving data from localStorage and setting
      // it in component
      var userData: any = localStorage.getItem("user")
      userData = JSON.parse(userData)
      this.username = userData.username;
      this.email = userData.email;
    }
  }

  // ************* Save Order ***************
  // From the product detail Page
  // if user add the product to cart. We first check if token
  // is available in localStorage. if not we route the user to user login page
  // After login he can then add product to Cart
  saveOrder() {
    // On clicking add to cart of product page
    // we set the quantity in the selected product object qty property
    this.global.selectedProduct.qty = this.qty;
    // setting the product Data in localStorage so that it may be accessible after page reload
    localStorage.setItem('orderData', JSON.stringify(this.global.selectedProduct))

    // Incase the user is not login , route to login page and display error
    var token = localStorage.getItem("token")
    if (token == undefined || token == null) {
      this.global.openSnackBar("Please Login Before Placing an Order");
      this.router.navigate(['/user-login'])
    }
    else {
    // If user is loggedIn route to cart page
      this.router.navigate(['/cart'])
    }
  }


  // ********** Change Quantity *************
  // This function update quantity of the product
  // based on the operator received from the parameter
  // "+" / "-"
  changeQty(operators?: string) {
    // Quantity change handler
    if (operators == "-") {
      this.qty = this.qty - 1;
    }
    else {
      this.qty = this.qty + 1
    }
  }


  // ************* Post Review ************
  // First we check that username, email, message & rating must not be null 
  // or undefined else an error popup is shown that details are missing
  // we then create a new review object with all 4 above mentioned properties
  // We don't have a seperate API for posting review. We use product update 
  // API. First we get existing reviews array associated with the product
  // we then add new review in reviewsArray and then post the reviewsArray 

  postReview() {
    // If any of the review form field is empty
    // show error
    if (
      (this.username == null || this.username == undefined) ||
      (this.email == null || this.email == undefined) ||
      (this.message == null || this.message == undefined) ||
      (this.rating == null || this.rating == undefined)
    ) {
      this.global.openSnackBar("Missing Detail !", "danger")
    }
    else {
    // Create an object with review data
      var review = {
        username: this.username,
        email: this.email,
        message: this.message,
        rating: this.rating.toString()
      }
      // we don't have a seperate API handler for adding & deleting
      // reviews. However, we use product data update API to add reviews
      var allReviewsData = {
      // we create an object that contain all the reviews for the product
        reviews: this.global.selectedProduct.reviews
      }
      // we then push the new reviews in all reviews data
      allReviewsData.reviews.push(review)

      // and finally push the object to the API
      this.global.postReviews(this.global.selectedProduct.id, allReviewsData).subscribe(
        data => {
          this.clearData();
          this.global.openSnackBar("Review Posted Successfully !", "success")
        },
        err => {
          this.global.openSnackBar("Review Cannot Be Posted  !", "danger")
        }
      )
    }
  }

  // *********** Clear Daya *************
  // this function refreshes the review form
  // called just after the review is posted successfully
  clearData() {
    // Clearing Review Form
    this.username = "";
    this.message = "";
  }
}
