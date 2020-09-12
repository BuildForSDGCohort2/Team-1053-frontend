import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/services/notifications/notifier.service';
import { AuthService } from 'src/app/services/users/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notifierService: NotifierService
  ) {}

  loginUser() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
      .subscribe(response => {
        if (!response) {
          this.notifierService.showNotification(
            this.authService.error[0], 'OK', 'error'
          );
        } else {
          this.router.navigate(['dashboard']);
        }
      });
    }
  }
  cancel() {
    this.router.navigate(['']);
  }
}
