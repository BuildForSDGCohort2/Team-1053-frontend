import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/users/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Logistics Manager';

  constructor(private auth: AuthService){}

  ngOnInit() {
    this.auth.checkAuthenticationStatus();
    this.auth.getCustomerProfile().subscribe();
  }
}
