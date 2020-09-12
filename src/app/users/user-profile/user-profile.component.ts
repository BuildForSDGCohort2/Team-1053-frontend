import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifications/notifier.service';
import { AuthService } from 'src/app/services/users/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  addressForm: FormGroup;

  


  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private notifier: NotifierService
  ) { }
  ngOnInit() {
    this.addressForm = this.fb.group({
      name: [this.auth.customer.name, Validators.required],
      first_name: [this.auth.customer.first_name, Validators.required],
      last_name: [this.auth.customer.last_name, Validators.required],
      address: [this.auth.customer.address, Validators.required],
      phone: [this.auth.customer.phone, Validators.required],
      city: [this.auth.customer.city, Validators.required],
      state: [this.auth.customer.state, Validators.required],
      postalCode: [this.auth.customer.postal_code, Validators.compose([
        Validators.required, Validators.minLength(5), Validators.maxLength(5)])
      ],
      shipping: ['free', Validators.required]
    });
  }
  updateProfile() {
    console.log(this.auth.customer);
    this.auth.updateUserProfile(this.addressForm.value)
      .subscribe(() => {
        this.notifier.showNotification('Profile Updated', 'OK', 'success');
      });
  }
}
