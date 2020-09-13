import { Component, OnInit } from '@angular/core';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Logistics Manager';

  constructor(private auth: AppService){}

  ngOnInit() {
    this.auth.checkAuthenticationStatus();
  }
}
