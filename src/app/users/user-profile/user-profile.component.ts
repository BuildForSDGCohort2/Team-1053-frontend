import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Customer } from 'src/app/models/app.model';
import { NotifierService } from 'src/app/services/notifications/notifier.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  public user: Customer = this.appService.currentCustomer;
  multiple = false;
  accept: string;
  readonly maxSize = 16;

  addressForm = this.fb.group({
    username: [this.user.username, Validators.required],
    email: [this.user.user.email, Validators.required],
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
    profile_pic: [null,
      [Validators.required, MaxSizeValidator(this.maxSize * 1024)]
    ]
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
    if (this.addressForm.valid) {
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
    }else{
      this.notifier.showNotification('Complete all the field values', 'OK', 'error');
    }
  }
}
