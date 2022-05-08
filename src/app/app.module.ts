import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LandingComponent } from './landing/landing.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ShopComponent } from './shop/shop.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MaterialExampleModule } from './material.module';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxStripeModule } from 'ngx-stripe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2SearchPipe } from 'ng2-search-filter';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    AdminLoginComponent,
    AdminPanelComponent,
    ShopComponent,
    CheckoutComponent,
    ProductDetailComponent,
    UserLoginComponent,
    UserDashboardComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    NgxPayPalModule,
    NgxSpinnerModule,
    MaterialExampleModule,
    NgxStripeModule.forRoot("pk_test_nDR7IWEIGLp4a1SBtqKH5eyg"),
    Ng2SearchPipeModule
  ],
  providers: [Ng2SearchPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
