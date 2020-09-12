import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { baseUrl } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User = JSON.parse(localStorage.getItem('user'));
  error: string;
  token = localStorage.getItem('token');
  customer: any;

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
        localStorage.setItem('token', JSON.stringify(response['key']));
        localStorage.setItem('user', JSON.stringify(response['user']));
      })
    )
    .pipe(catchError(err => {
      this.error = err.error.email ? err.error.email : err.error.non_field_errors;
      return of(false);
    }));
  }

  updateUserProfile(data) {
    return this.http.put(`${baseUrl}customers/${this.currentUser.id}/`, data);
  }

  getCustomerProfile() {
    const options = {
      headers: new HttpHeaders({
        Authorization: `Token ${this.token}`
      })
    };
    return this.http.get(`${baseUrl}customers/${this.currentUser.id}/`)
      .pipe(tap(data => {
        if (data instanceof Object) {
          this.customer = data;
        }
      }));
  }

  logout() {
    this.currentUser = undefined;
    localStorage.clear();
    return this.http.post(`${baseUrl}user/logout/`, {});
  }

}
