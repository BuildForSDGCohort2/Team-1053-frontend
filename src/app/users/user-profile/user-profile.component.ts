import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/models/app.model';
import { NotifierService } from 'src/app/services/notifications/notifier.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  public user: Customer = this.appService.currentCustomer;

  addressForm = this.fb.group({
    username: [this.user.username, Validators.required],
    first_name: [this.user.first_name, Validators.required],
    last_name: [this.user.last_name, Validators.required],
    address: [this.user.address, Validators.required],
    phone: [this.user.mobile, Validators.required],
    city: [this.user.city, Validators.required],
    street: [this.user.street, Validators.required],
    postal_code: [
      this.user.postal_code,
      Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
      ]),
    ],
    shipping: ['free', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public appService: AppService,
    private notifier: NotifierService
  ) {}
  ngOnInit() {
    this.appService.getCustomerProfile().subscribe();
  }

  updateProfile() {
    this.appService
      .updateUserProfile(this.addressForm.value)
      .subscribe((res) => {
        if (!res) {
          this.notifier.showNotification(this.appService.error, 'OK', 'error');
        } else {
          this.notifier.showNotification(
            this.appService.successMessage,
            'OK',
            'success'
          );
          this.appService.getCustomerProfile().subscribe();
        }
      });
  }
}
