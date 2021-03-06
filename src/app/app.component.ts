import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { auth } from 'firebase';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Logistics Manager';
  private isDark = false;
  user = this.auth.currentUser;
  customer;

  @HostBinding('class')
  get themeMode() {
    return this.isDark ? 'theme-dark' : 'theme-light';
    }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private auth: AppService,
    public snackBar: MatSnackBar
  ){}

  switchMode(isDarkMode: boolean) {
    this.isDark = isDarkMode;
    const hostClass = this.isDark ? 'theme-dark' : 'theme-light';
    this.renderer.setAttribute(this.document.body, 'class', hostClass);
  }

  showSnackbarAction() {
    this.snackBar.open('Your profile Is Incomplete', 'Please update Your Profile');
  }

  ngOnInit() {
    this.auth.checkAuthenticationStatus();
    this.auth.getCustomerProfile().subscribe();
    this.customer = this.auth.currentCustomer;
    if (this.auth.currentUser !== null && this.customer == null) {
      this.showSnackbarAction();
    }

  }
}
