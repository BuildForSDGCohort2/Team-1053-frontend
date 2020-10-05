import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { baseUrl } from 'src/environments/environment';
import { LocalStorageService } from '../storage/local-storage.service';



@Injectable({
  providedIn: 'root'
})

export class AppService {
  public currentCustomer;
  error: string;
  public currentUser;
  successMessage: string;
  public token: string;
  options;

  constructor(private http: HttpClient, private storage: LocalStorageService) {
    this.storage.getItem('currentUser').subscribe(user =>
      this.currentUser = JSON.parse(user));
    this.storage.getItem('token').subscribe(token =>
      this.token = JSON.parse(token));
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Token ${this.token}`
      })
    };
   }

  checkAuthenticationStatus() {
    this.storage.getItem('customer').subscribe(customer =>
      this.currentCustomer = JSON.parse(customer));
    return this.currentUser !== null;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }
  register(data: object) {
    return this.http.post(`${baseUrl}user/registration`, data)
    .pipe(
      tap(response => {
        this.storage.setItem(
          'currentUser', JSON.stringify(response['user'])
        );
        localStorage.setItem('token', JSON.stringify(response['key']));
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
        this.storage.setItem(
          'currentUser', JSON.stringify(response['user'])
        );
        localStorage.setItem('token', JSON.stringify(response['key']));
      })
    )
    .pipe(catchError(err => {
      this.error = err.error.email ? err.error.email : err.error.non_field_errors;
      return of(false);
    }));
  }
  changeUserPassword(data) {
    return this.http.post(`${baseUrl}user/password/change/`, data, this.options);
  }

  updateUser(data) {
    return this.http.put(
      `${baseUrl}user/user/`, data, this.options
    );
  }

  getFormData = object => Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
  }, new FormData())

  updateContactInfo(data) {
    const options = {
      headers: new HttpHeaders({
        Authorization: `Token ${this.token}`
      })
    };
    if (this.currentCustomer !== null) {
      return this.http.put(
        `${baseUrl}customers/${this.currentCustomer.id}/`,
        this.getFormData(data), options
      )
        .pipe(tap(res => {
          this.successMessage = 'Profile Successfully Updated';
        }))
        .pipe(catchError(err => {
          if (err.error instanceof Object) {
            const errorKey = Object.keys(data).filter(er => er === Object.keys(err.error)[0])[0];
            this.error = err.error[errorKey];
          }else{
            this.error = 'Server Connection Error';
          }
          return of(false);
        }));
    } else {
      return this.http.post(
        `${baseUrl}customers/`,
        this.getFormData(data), options
      );
    }
  }

  getCustomerProfile() {
    if (this.currentUser !== undefined) {
      return this.http.get(
        `${baseUrl}customers/${this.currentUser.id}/`, this.options
      )
        .pipe(tap(data => {
          if (data instanceof Object) {
            this.storage.setItem('customer', JSON.stringify(data));
          }
        }))
        .pipe(catchError(err => {
          console.log(err)
          this.storage.setItem('customer', JSON.stringify(null));
          return of(false);
        }));
    }
  }

  logout() {
    this.currentUser = undefined;
    this.currentCustomer = null;
    localStorage.clear();
    return this.http.post(`${baseUrl}user/logout/`, {});
  }
  getCustomers() {
    return this.http.get(`${baseUrl}customers/`, this.options);
  }
  deleteCustomer(id: number) {
    return this.http.delete(`${baseUrl}customers/${id}`, this.options);
  }

}
