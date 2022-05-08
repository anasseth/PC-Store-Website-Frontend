import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment'
import {
    MatSnackBar,
    MatSnackBarConfig,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    passObject: any;
    isLogin?: boolean;
    headers = new HttpHeaders().set('Content-Type', 'application/json');
    selectedProduct: any;
    userData: any;
    action: boolean = true;
    setAutoHide: boolean = true;
    autoHide: number = 2000;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    addExtraClass: boolean = true;

    constructor(private http: HttpClient, public snackBar: MatSnackBar) { }

    getUserName() {
        const userData: any = localStorage.getItem('user');
        let username = JSON.parse(userData).Username
        console.log(username)
        return username
    }
    getCurrencyUpdate() {
        return this.http.get("https://api.currencyfreaks.com/latest?apikey=178315ed37f24b2090b002624a6104ce")
    }
    userRegistration(userDetails: any): Observable<any> {
        console.log(userDetails);
        return this.http.post(environment.apiURL + 'user', userDetails).pipe(catchError(this.error));
    }
    userLogin(userDetails: any): Observable<any> {
        console.log(userDetails);
        const token = localStorage.getItem('token');
        return this.http.post(environment.apiURL + 'login', userDetails).pipe(catchError(this.error));
    }
    postOrderData(Data: any): Observable<any> {
        return this.http.post<any>(environment.apiURL + 'order', Data).pipe(catchError(this.error))
    }
    adminLogin(obj: any): Observable<any> {
        return this.http.post<any>(environment.apiURL + 'password', obj).pipe(catchError(this.error))
    }
    getOrderData(): Observable<any> {
        return this.http.get<any>(environment.apiURL + 'order').pipe(catchError(this.error))
    }
    getProductData(): Observable<any> {
        return this.http.get<any>(environment.apiURL + 'products').pipe(catchError(this.error))
    }
    postReviews(productID: string, body: any) {
        return this.http.put<any>(environment.apiURL + 'products/reviews/' + productID, body).pipe(catchError(this.error))
    }
    deleteOrder(id: any) {
        return this.http.delete<any>(environment.apiURL + 'order/' + id).pipe(catchError(this.error))
    }
    updateStatus(id: any, obj: any) {
        return this.http.put<any>(environment.apiURL + 'order/update-status/' + id, obj).pipe(catchError(this.error))
    }
    updatePassword2(obj: any) {
        return this.http.put<any>(environment.apiURL + 'password' + this.passObject.id, obj).pipe(catchError(this.error))
    }
    updateUserPassword(obj: any) {
        const token = localStorage.getItem('token');
        return this.http.put<any>(environment.apiURL + 'user/' + obj.username, obj, {
            headers: new HttpHeaders(
                {
                    Authorization: 'Bearer ' + token,
                })
        }).pipe(catchError(this.error))
    }
    updatePassword(obj: any) {
        var passObject: any;
        console.log(obj)
        this.adminLogin(obj).subscribe(
            (data) => {
            }, (err) => {
                console.log(err)
                this.openSnackBar(err)
            }, () => {
                if (true) {
                    obj.password = obj.newpassword;
                    obj.name = this.passObject.name
                    delete obj.newpassword;
                    console.log(obj)
                    this.updatePassword2(obj).subscribe(
                        (data) => {
                            console.log(data)
                            this.openSnackBar("Password Updated Successfully", "success")
                        }, (err) => {
                            this.openSnackBar(err)
                            console.log(err)
                        }
                    )
                }
            }
        )

    }

    error(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }

    openSnackBar(message: string, action?: string) {
        var snackBarType = action == "success" ? "success" : "danger"
        this.snackBar.open(message, undefined, {
            duration: 4000,
            verticalPosition: this.verticalPosition,
            horizontalPosition: this.horizontalPosition,
            panelClass: snackBarType,
        });
    }

}
