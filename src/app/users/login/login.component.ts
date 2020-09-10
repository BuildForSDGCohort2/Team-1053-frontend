import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  error: any;
  loginUser() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        result => {
          if (result.key) {
            console.log(result);
            alert(result.key);
          }
        },
        err => {
          this.error = err.error;
          if (this.error.email) {
            console.log(this.error.email[0]);
          } else {
            console.log(this.error.non_field_errors[0]);
          }
        }
      );
    }
  }
}
