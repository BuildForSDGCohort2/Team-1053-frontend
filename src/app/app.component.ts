import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, OnInit, Renderer2 } from '@angular/core';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Logistics Manager';
  private isDark = false;

  @HostBinding('class')
  get themeMode() {
    return this.isDark ? 'theme-dark' : 'theme-light';
    }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private auth: AppService
  ){}

  switchMode(isDarkMode: boolean) {
    this.isDark = isDarkMode;
    const hostClass = this.isDark ? 'theme-dark' : 'theme-light';
    this.renderer.setAttribute(this.document.body, 'class', hostClass);
  }

  ngOnInit() {
    this.auth.checkAuthenticationStatus();
  }
}
