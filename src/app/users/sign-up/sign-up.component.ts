import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/services/notifications/notifier.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { AppService } from 'src/app/services/user/app.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm = this.fb.group({
    username: [null, Validators.required],
    email: [null, Validators.compose([
      Validators.required,
      Validators.email
    ])],
    first_name: [null, Validators.required],
    last_name: [null, Validators.required],
    password1: [
      null,
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15),
        Validators.pattern('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/')
      ]),
    ],
    password2: [
      null,
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15),
        Validators.pattern('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/')
      ]),
    ]
  });
  hide = true;
  error: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AppService,
    private notifierService: NotifierService,
    private storage: LocalStorageService
  ) { }

  signUp() {
    if (this.signUpForm.valid) {
      this.authService.register(this.signUpForm.value)
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
}
