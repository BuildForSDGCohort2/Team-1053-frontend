import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LocalStorageService } from '../services/storage/local-storage.service';
import { AppService } from '../services/user/app.service';

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
    private router: Router,
    private storage: LocalStorageService
  ) { }

  logout() {
    this.auth.logout().subscribe(() => {
      this.storage.clear();
      this.router.navigate(['/login']);
    }
    );
  }
  onDarkModeSwitched({checked}: MatSlideToggleChange) {
    this.darkModeSwitched.emit(checked);
  }

  ngOnInit() {
    this.auth.checkAuthenticationStatus();
  }

}
