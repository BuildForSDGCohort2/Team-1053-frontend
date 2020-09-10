import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) { }

  checkAuthenticated() {
    return this.isAuthenticated;
  }

  signUp(username: string, email: string, password: string) { }

  login(email: string, password: string): Observable<any> {
    this.isAuthenticated.next(true);
    return;
  }
  async logout(redirect: string){}
}
