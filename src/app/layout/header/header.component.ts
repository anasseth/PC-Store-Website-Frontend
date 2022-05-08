import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public _router: Router) { }

  ngOnInit(): void {
  }
  navigateToLogin() {
    this._router.navigate(["/login"])
  }
  navigateToUserLogin() {
    this._router.navigate(["/user-login"])
  }
  navigateToShop() {
    this._router.navigate(["/shop"])
  }
  navigateToHome() {
    this._router.navigate(["/"])
  }

}
