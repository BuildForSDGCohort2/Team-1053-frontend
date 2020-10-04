import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/services/notifications/notifier.service';
import { AppService } from 'src/app/services/user/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: [null, Validators.compose([
      Validators.required,
      Validators.email
    ])],
    password: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AppService,
    private router: Router,
    private notifierService: NotifierService
  ) { }
  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['dashboard']);
    }
  }

  loginUser() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
      .subscribe(response => {
        if (!response) {
          this.notifierService.showNotification(
            this.authService.error[0], 'OK', 'error'
          );
        } else {
          this.router.navigate(['profile']);
        }
      });
    }
  }
  displayForm() {

  }
  cancel() {
    this.router.navigate(['']);
  }
}
