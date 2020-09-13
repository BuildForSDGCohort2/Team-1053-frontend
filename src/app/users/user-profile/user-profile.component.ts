import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/models/app.model';
import { NotifierService } from 'src/app/services/notifications/notifier.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  addressForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AppService,
    private notifier: NotifierService
  ) {}
  updateProfile() {
    this.auth.updateUserProfile(this.addressForm.value)
      .subscribe(() => {
        this.notifier.showNotification('Profile Updated', 'OK', 'success');
      });
  }
  ngOnInit() {
    this.auth.getCustomerProfile().subscribe((customer: Customer) => {
      this.addressForm = this.profileForm(customer);
    });
  }
  profileForm(customer: Customer) {
    console.log(customer);
    return this.fb.group({
      name: [customer.phone, Validators.required],
      first_name: [customer.first_name, Validators.required],
      last_name: [customer.last_name, Validators.required],
      address: [customer.address, Validators.required],
      phone: [customer.phone, Validators.required],
      city: [customer.city, Validators.required],
      state: [customer.state, Validators.required],
      postalCode: [customer.postalCode, Validators.compose([
        Validators.required, Validators.minLength(5), Validators.maxLength(5)])
      ],
      shipping: ['free', Validators.required]
    });
  }
}
