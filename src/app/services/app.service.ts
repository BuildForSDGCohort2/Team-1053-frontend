import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Customer, User } from 'src/app/models/app.model';
import { baseUrl } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  currentUser: User = JSON.parse(localStorage.getItem('user'));
  public currentCustomer: Customer = JSON.parse(localStorage.getItem('customer'));
  error: string;
  successMessage: string;
  token: string = localStorage.getItem('token');
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // tslint:disable-next-line: object-literal-key-quotes
      'Authorization': `Token ${this.token}`
    })
  };

  constructor(private http: HttpClient) { }

  checkAuthenticationStatus() {
    const user = localStorage.getItem('user');
    this.currentUser = JSON.parse(user);
    return;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }
  register(data: object) {
    return this.http.post(`${baseUrl}user/registration`, data)
    .pipe(
      tap(response => {
        this.currentUser = response['user'] as User;
        localStorage.setItem('token', JSON.stringify(response['key']));
        localStorage.setItem('token', JSON.stringify(this.currentUser));
      })
    )
    .pipe(catchError(err => {
      if (err.error.email) {
        this.error = err.error.email;
      } else if (err.error.password1) {
        this.error = err.error.password1;
      } else if (err.error.non_field_errors) {
        this.error = err.error.non_field_errors;
      }
      return of(false);
    }));
  }

  login(data: object) {
    return this.http.post(`${baseUrl}user/login/`, data)
    .pipe(
      tap(response => {
        this.currentUser = response['user'] as User;
        localStorage.setItem('token', response['key']);
        localStorage.setItem('user', JSON.stringify(this.currentUser));
      })
    )
    .pipe(catchError(err => {
      this.error = err.error.email ? err.error.email : err.error.non_field_errors;
      return of(false);
    }));
  }

  updateUserProfile(data) {
    return this.http.put(
      `${baseUrl}customers/${this.currentUser.id}/`, data, this.options)
      .pipe(tap(res => {
        this.successMessage = 'Profile Successfully Updated';
      }))
      .pipe(catchError(err => {
        this.error = err.error.detail ? err.error.detail : 'Server Connection Error';
        return of(false);
      }));
  }

  getCustomerProfile() {
    if (this.currentUser !== undefined) {
      return this.http.get(
        `${baseUrl}customers/${this.currentUser.id}/`, this.options
      )
        .pipe(tap(data => {
          if (data instanceof Object) {
            localStorage.setItem('customer', JSON.stringify(data));
          }
        }))
        .pipe(catchError(err => {
          this.error = err.error;
          return of(false);
        }));
    }
  }

  logout() {
    this.currentUser = undefined;
    localStorage.clear();
    return this.http.post(`${baseUrl}user/logout/`, {});
  }

  getStock() {
    return this.http.get('http://127.0.0.1:8000/api/v1/stock/')
    .pipe(tap(data => {
      if (data instanceof Array) {
        return data;
      }
    }));
  }
  getProducts() {
    return this.http.get('http://127.0.0.1:8000/api/v1/products/');
  }

  getOrderSummary(){}

}
