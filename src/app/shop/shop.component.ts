import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  PC_Data: any = [
    {
      company_name: "RAZER",
      model: "Blade 15 Base Gaming Laptop 2020",
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
      original_price: "499",
      discounted_price: "399",
      feature: [
        "'15.6', 120Hz Full HD",
        "AMD 5 R5-3550H Processor",
        "GeForce GTX 1650 Graphics",
        "8GB DDR4, 256GB PCIe SSD"
      ],
      imageURL: "https://m.media-amazon.com/images/I/81gK08T6tYL._AC_SL1500_.jpg"
    },
    {
      company_name: "RAZER",
      model: "Blade 15 Base Gaming Laptop 2020",
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
      original_price: "499",
      discounted_price: "399",
      feature: [
        "'15.6', 120Hz Full HD",
        "AMD 5 R5-3550H Processor",
        "GeForce GTX 1650 Graphics",
        "8GB DDR4, 256GB PCIe SSD"
      ],
      imageURL: "https://m.media-amazon.com/images/I/81gK08T6tYL._AC_SL1500_.jpg"
    },
    {
      company_name: "RAZER",
      model: "Blade 15 Base Gaming Laptop 2020",
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
      original_price: "499",
      discounted_price: "399",
      feature: [
        "'15.6', 120Hz Full HD",
        "AMD 5 R5-3550H Processor",
        "GeForce GTX 1650 Graphics",
        "8GB DDR4, 256GB PCIe SSD"
      ],
      imageURL: "https://m.media-amazon.com/images/I/81gK08T6tYL._AC_SL1500_.jpg"
    },
    {
      company_name: "RAZER",
      model: "Blade 15 Base Gaming Laptop 2020",
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
      original_price: "499",
      discounted_price: "399",
      feature: [
        "'15.6', 120Hz Full HD",
        "AMD 5 R5-3550H Processor",
        "GeForce GTX 1650 Graphics",
        "8GB DDR4, 256GB PCIe SSD"
      ],
      imageURL: "https://m.media-amazon.com/images/I/81gK08T6tYL._AC_SL1500_.jpg"
    },
    {
      company_name: "RAZER",
      model: "Blade 15 Base Gaming Laptop 2020",
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
  ]

  constructor(public _router: Router) { }

  ngOnInit(): void {
  }

  navigateToLogin() {
    this._router.navigate(["/login"])
  }

  navigateToHome() {
    this._router.navigate(["/"])
  }

  saveOrder(i: any) {
    console.log(i)
    i.qty = 1;
    localStorage.setItem('orderData', JSON.stringify(i))
    this._router.navigate(['/cart'])
  }

}
