import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/models/app.model';
import { baseUrl } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  currentUser: User = JSON.parse(localStorage.getItem('user'));
  error: string;
  token = localStorage.getItem('token');
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
      `${baseUrl}customers/${this.currentUser.id}/`,
      this.options,
      data
    );
  }

  getCustomerProfile() {
    return this.http.get(
      `${baseUrl}customers/${this.currentUser.id}/`, this.options
    )
      .pipe(tap(data => {
        if (data instanceof Object) {
          return data;
        }
      }));
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

}
