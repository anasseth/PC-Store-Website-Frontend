import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../Services/global.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  @ViewChild('myModal') myModal: any;

  fileName = 'Order-Data.xlsx';
  orderData: any;
  selectedOrder: any = 0;
  reviewsData: any;
  productData: any;
  totalRevenue: any = 0;
  totalProfit: any = 0;
  closeResult!: string;
  showCommentDailog: boolean = false;
  categorySelected: string = "All";
  isOrder: boolean = true;
  isProduct: boolean = false;
  activeProduct: any;

  constructor(private spinner: NgxSpinnerService, public global: GlobalService, public router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    console.log(this.global.isLogin)
    // On Page Load, We check if the user is logged In or not
    if (this.global.isLogin == false || this.global.isLogin == undefined) {
      // if isLogin Flag is false we try to check the isLogin flag available in localStorage
      // if that is also false. We just route the ADMIN to admin login page
      if (JSON.parse(localStorage.getItem("isLogin") || "") != true || JSON.parse(localStorage.getItem("isLogin") || "") == undefined) {
        this.router.navigate(["/login"])
        console.log(this.global.isLogin)
      }
      else {
        // if isLogin variable is true
        this.global.isLogin = true;
        // We just get the order Data from database
        this.global.getOrderData().subscribe(
          (data) => {
            console.log(data)
            // setting the data received from API in components variable
            this.orderData = data;
            // we then call calculateAmont method to calculate Revenue and Profits
            this.calculateAmounts()
          },
          (err) => {
            // Incase of error we just popup an error
            this.global.openSnackBar("Error ! Cannot Load Data At The Moment")
          }, () => {
            // if there is no error
            // we just switch to the next API Call to get Product Data
            this.global.getProductData().subscribe(
              (data) => {
                console.log(data)
                // setting Product data in component property
                this.productData = data;
              },
              (err) => {
                this.global.openSnackBar("Error ! Cannot Load Data At The Moment")
              }
            )
          }
        )
      }
    }
    else {
      this.global.isLogin = true;
      this.global.getOrderData().subscribe(
        (data) => {
          console.log(data)
          this.orderData = data;
          this.calculateAmounts()
        }
      )
    }
  }

  // ******** Delete Order ***********
  // When user clicks on delete icon. The Order ID is received from parameter
  // we simply hit delete Order API and send id in it. if operation is successfull
  // order will be deleted successfully and after that we call calculateAmount()
  // to calculate revenue and total profit again.
  // Incase of error, show error popup
  deleteOrder(id: any, index: any) {
    // Deleting Order Data
    this.spinner.show();
    console.log("ID : ", id)
    // id received from the parameter and just passed it in service method to delete 
    this.global.deleteOrder(id).subscribe(
      data => {
        this.spinner.hide();
        console.log(data)
        // filtering order data from frontend 
        this.orderData = this.orderData.filter((x: any) => x.id != id)
        // we then call calculateAmount method to calculate Revenue and Profits
        this.calculateAmounts()
        // if the operation is successfull, show popup
        this.global.openSnackBar("Deleted Successfully !", "success")
      },
      err => {
        // hiding spinner
        this.spinner.hide();
        console.log(err)
        // if the operation is unsuccessful show delete error message
        this.global.openSnackBar("Error ! Cannot Delete At The Moment")
      }, () => {
      }
    )
  }

  // ********** Calculate Amount *************
  // Total Revenue & Total Profit are Calculated in this function.
  // we loop over the orderData and add up discounted_price multiply by qty
  // for profit we multiply by 30% of the total Revenue
  // finally we just round the total Profit to 2 Decimal places
  calculateAmounts() {
    // setting total Revenue to zero
    this.totalRevenue = 0;
    // setting total Profit to zero
    this.totalProfit = 0;
    for (var i = 0; i < this.orderData.length; i++) {
      // Looping over orderData to calculate total Revenue
      this.totalRevenue = this.totalRevenue + Number(this.orderData[i].discounted_price * this.orderData[i].qty)
      // adding up total Profit and setting 30% profit of total revenue
      this.totalProfit = this.totalProfit + 0.3 * Number(this.orderData[i].discounted_price * this.orderData[i].qty)
    }
    // Setting Profit to 2 decimal places
    this.totalProfit = (this.totalProfit.toFixed(2)).toString()
  }

  // ************ Delete Review *****************
  // We don't have a seperate API for deleting review. We use product update 
  // API. First we get existing reviews array associated with the product
  // we then remove that particular review in reviewsArray and then post the reviewsArray 
  // using update product API
  deleteReview(review: any, index: any) {
    // Delete Reviews from Admin Panel
    this.spinner.show()
    // Creating an object with all reviews except the deleted one
    // using .filter on reviewsData
    var allReviewsData = {
      reviews: this.reviewsData.filter((x: any) => x._id != review._id)
    }
    console.log(allReviewsData)
    setTimeout(() => {
      // Updating Reviews Data by posting on API 
      this.global.postReviews(this.activeProduct.id, allReviewsData).subscribe(
        data => {
          // Showing loader
          this.spinner.hide()
          // filtering reviews data from frontend after successful updating on API
          this.reviewsData = this.reviewsData.filter((x: any) => x._id != review._id)
          this.global.openSnackBar("Review Deleted Successfully !", "success")
        },
        err => {
          this.spinner.hide()
          this.global.openSnackBar("Review Cannot Be Deleted  !", "danger")
        }
      )
    }, 2000);
  }

  // ************ Export Excel ****************
  // The Table in our .html file has an id property = "excel-table"
  // the FileName Property is setted to "Product-Data.xlsx" if Product Screen is active
  // the FileName Property is setted to "Order-Data.xlsx" if Order Screen is active
  // Finally, the XLSX.WorkSheet func helps to create the excel file and converts
  // out HTML Table data into excel tables
  exportexcel(): void {
    /* table id is passed over here */
    if (this.isProduct) {
      this.fileName = "Product-Data.xlsx"
    }
    else {
      this.fileName = "Order-Data.xlsx"
    }
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }


  // *********** Change Status *************
  // This function update the order status on click
  // current status is received from function parameter and 
  // if status is Pending we update it to delivered and then the order data is updated  
  changeStatus(status?: string, index?: any) {
    // Changing Status Function
    console.log(status)
    // if status is Pending
    if (status == "Pending") {
      // set it to delivered 
      this.orderData[index].status = "Delivered"
    }
    else {
      this.orderData[index].status = "Pending"
    }
    // create an object with status property and posting 
    // on API
    var object = {
      status: this.orderData[index].status
    }
    this.global.updateStatus(this.orderData[index].id, object).subscribe(
      data => {
        // On successfull operation
        // Show success popup
        this.global.openSnackBar("Status Updated Successfully !", "success")
      },
      err => {
        // Incase of error , show error popup
        this.global.openSnackBar("Status Not Updated !")
      }
    )
  }

  // *********** Popup Opening Function ************
  // This function is provided by Modal Library
  open(content: any, index?: any) {
    // Handling Reviews Dailog
    // setting Selected Order index received from parameter
    this.selectedOrder = index
    // Setting Show Comment Dailog to true 
    this.showCommentDailog = true;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // *********** Popup Closing Function ************
  // This function is provided by Modal Library
  private getDismissReason(reason: any): string {
    // Close All Popup 
    // This function is from Bootstrap ngModal
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  logOut() {
    localStorage.clear()
    this.router.navigate(["/login"])
  }

  // ************** Set Category ******************
  // this function set category selected property that it received from categoryName parameter
  setCategory(categoryName: string) {
    this.categorySelected = categoryName
  }

  // ************* Filtered Data ******************
  // if categorySelected property is setted to All
  // we return all Data else we then filter it based on categorySelected
  getFilteredData() {
    // This function returns
    // filtered Data from all order data / all product data based on Category Name
    if (this.categorySelected == "All") {
      // If category is set to All return whole Data
      if (this.isOrder) {
        // if order screen is active, return all order data
        return this.orderData
      }
      else {
        // if product screen is active, return all product data
        return this.productData
      }
    }
    else {
      // if category is not equal to All.
      if (this.isOrder) {
        // return filtered order Data based on selected category
        return this.orderData.filter((x: any) => x.category == this.categorySelected)
      }
      else {
        // return filtered product Data based on selected category
        return this.productData.filter((x: any) => x.category == this.categorySelected)
      }
    }
  }

  // ********** View Comment **********
  // We get index and content (to open popup) 
  // index is from ngfor loop. We use that index to get reviews from
  // AllReviewsData and set it in reviewsData variable
  viewComment(order?: any, content?: any, index?: any) {
    console.log(order)
    console.log()
    this.reviewsData = this.productData[index].reviews;
    this.activeProduct = this.productData[index]
    this.open(content, index)
  }

  // ********** Set Table *********
  // this function switches between order Data and Product Data
  // By setting variable to rue and false
  setTable(tableName?: any) {
    // Switching Between Order and Product Screen
    if (tableName == "Products") {
      this.isProduct = true;
      this.isOrder = false;
    }
    else {
      this.isProduct = false;
      this.isOrder = true;
    }
  }
}
