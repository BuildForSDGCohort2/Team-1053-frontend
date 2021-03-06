import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppService } from '../services/app.service';
import { Router } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public auth: AppService,
    private router: Router
  ) { }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
    }
    );
  }
  onDarkModeSwitched({checked}: MatSlideToggleChange) {
    this.darkModeSwitched.emit(checked);
  }

  ngOnInit() {
    this.auth.checkAuthenticationStatus();
    this.auth.getCustomerProfile().subscribe();
  }

}
