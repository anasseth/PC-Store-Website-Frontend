import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShopComponent } from './shop/shop.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserLoginComponent } from './user-login/user-login.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    component: LandingComponent
  }
  , {
    path: 'login',
    component: AdminLoginComponent
  }
  , {
    path: 'admin',
    component: AdminPanelComponent
  }
  , {
    path: 'shop',
    component: ShopComponent
  }
  , {
    path: 'cart',
    component: CheckoutComponent
  }
  , {
    path: 'product-detail',
    component: ProductDetailComponent
  }
  , {
    path: 'user-login',
    component: UserLoginComponent
  }
  , {
    path: 'user-dashboard',
    component: UserDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
