import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(public _router: Router) { }

  ngOnInit(): void {
  }

  navigateToLogin() {
    this._router.navigate(["/login"])
  }

  navigateToShop() {
    this._router.navigate(["/shop"])
  }

  navigateToHome() {
    this._router.navigate(["/"])
  }


}
