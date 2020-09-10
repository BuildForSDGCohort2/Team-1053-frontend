import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs';
import { baseUrl } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private http: HttpClient) { }

  checkAuthenticated() {
    return this.isAuthenticated;
  }

  register(data): Observable<any> {
    return this.http.post(`${baseUrl}user/registration`, data);
  }

  login(data): Observable<any> {
    return this.http.post(`${baseUrl}user/login/`, data);
  }

  logout(redirect: string) { }
}
