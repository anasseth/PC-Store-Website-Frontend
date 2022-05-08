import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../Services/global.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  categorySelected: string = "All";
  searchText = ""
  PC_Data: any = [
    {
      company_name: "RAZER",
      model: "Blade 15 Base Gaming Laptop 2020",
      category: "Laptop",
      original_price: "890",
      discounted_price: "789",
      feature: [
        "Intel Core i7-10750H 6-Core",
        "NVIDIA GeForce GTX 1660 Ti",
        "'15.6' FHD 1080p 120Hz",
        "16GB RAM, 256GB SSD"
      ],
      imageURL: "https://m.media-amazon.com/images/I/81w+3k4U8PL._AC_SL1500_.jpg"
    },
    {
      company_name: "LENOVO",
      model: "Legion 5 Gaming Laptop",
      category: "Laptop",
      original_price: "680",
      discounted_price: "540",
      feature: [
        "'15.6' FHD (1920x1080) IPS Screen",
        "AMD 7 4800H Processor",
        "16GB DDR4",
        "512GB SSD"
      ],
      imageURL: "https://m.media-amazon.com/images/I/71wF7YDIQkL._AC_SL1500_.jpg"
    },
    {
      company_name: "ASUS",
      model: "TUF FX505DT Gaming Laptop",
      category: "Laptop",
      original_price: "499",
      discounted_price: "399",
      feature: [
        "'15.6', 120Hz Full HD",
        "AMD 5 R5-3550H Processor",
        "GeForce GTX 1650 Graphics",
        "8GB DDR4, 256GB PCIe SSD"
      ],
      imageURL: "https://m.media-amazon.com/images/I/81gK08T6tYL._AC_SL1500_.jpg"
    }
    , {
      company_name: "LENOVO",
      model: "IdeaCentre AIO 3i",
      category: "PC",
      original_price: "519",
      discounted_price: "499",
      feature: [
        "Intel® Core™ i5-1135G7 Processor",
        "RAM: 8 GB DDR4",
        "Full HD display",
        "512 GB SSD"
      ],
      imageURL: "../../assets/images/laptop-01.jpg"
    }


    , {
      company_name: "ACER",
      model: "Aspire XC-1660",
      category: "Accessories",
      original_price: "499",
      discounted_price: "399",
      feature: [
        "Intel® Core™ i5-11400 ",
        "RAM: 8 GB DDR4",
        "Black Color",
        "1 TB HDD"
      ],
      imageURL: "../../assets/images/cpu-01.jpg"
    }

    , {
      company_name: "ACER",
      model: "Aspire C24-1650",
      category: "PC",
      original_price: "739",
      discounted_price: "629",
      feature: [
        "Intel® Core™ i5-1135G7 ",
        "RAM: 8 GB DDR4",
        "Black Color | Full HD Display",
        "256 GB HDD"
      ],
      imageURL: "../../assets/images/pc-01.jpg"
    }

    , {
      company_name: "APPLE",
      model: "iMac 4.5K 24 (2021)",
      category: "MAC",
      original_price: "1339",
      discounted_price: "1200",
      feature: [
        "Apple M1 chip",
        "RAM: 8 GB DDR4",
        "Retina 4.5K Ultra HD display",
        "256 GB SSD"
      ],
      imageURL: "../../assets/images/mac-01.jpg"
    }
  ]

  constructor(public _router: Router, public global: GlobalService) { }

  ngOnInit(): void {
    // On Page Load, We just call an API
    console.log(JSON.stringify(this.PC_Data, undefined, 2))
    this.global.getProductData().subscribe(
      (data: any) => {
        this.PC_Data = data
      },
      (err) => {
        // Incase If API returned an error. We just render the data of product in our static variable
        this.global.openSnackBar(err, "danger")
      }
    )
  }

  navigateToLogin() {
    this._router.navigate(["/login"])
  }

  navigateToHome() {
    this._router.navigate(["/"])
  }


  // *********** Save Order **************
  // this function is really simple. it just get product data 
  // from paramter as i. We set a Quantity Parameter , qty and set the qty = 1
  // After that we just set the Product object in localstorage so that it can be accessible.
  // We then route to product-detail page.
  saveOrder(i: any) {
    console.log(i)
    i.qty = 1;
    // Storing Product Data in Local Storage
    localStorage.setItem('orderData', JSON.stringify(i))
    this.global.selectedProduct = i
    // Routing To Product Detail
    this._router.navigate(['/product-detail'])
  }

  // ************** Set Category ******************
  // this function set category selected property that it received from categoryName parameter
  setCategory(categoryName: string) {
    this.categorySelected = categoryName
  }

  // ************* Filtered Data ******************
  // if categorySelected property is setted to All
  // we return all Product Data else we then filter it based on categorySelected
  getFilteredData() {
    if (this.categorySelected == "All") {
      return this.PC_Data
    }
    else {
      return this.PC_Data.filter((x: any) => x.category == this.categorySelected)
    }
  }

}
