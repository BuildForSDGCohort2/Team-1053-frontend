import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/users/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm = this.fb.group({
    username: [null, Validators.required],
    email: [null, Validators.required],
    password1: [null, Validators.required],
    password2: [null, Validators.required]
  });

  error: any;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  signUp() {
    if (this.signUpForm.valid) {
      this.authService.register(this.signUpForm.value).subscribe(
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
          } else if (this.error.password1) {
            console.log(this.error.password1[0]);
          } else if (this.error.non_field_errors) {
            console.log(this.error.non_field_errors[0]);
          }
        }
      );
    }
  }
}
