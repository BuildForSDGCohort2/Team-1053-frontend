import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MaxSizeValidator } from '@angular-material-components/file-input';
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
  multiple = false;
  accept: string;

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
    profile_pic: [null, Validators.required]
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
      this.addressForm.get('profile_pic').setValue(
        this.addressForm.value.profile_pic.name
       )
      console.log(this.addressForm.value)
      
      // this.imageData.append(
      //   'file', this.addressForm.value.profile_pic);
      // console.log(this.imageData)
      // this.addressForm.value.profile_pic = this.imageData;
      this.appService
      .updateUserProfile(this.addressForm.value)
      .subscribe((res) => {
        if (!res) {
          console.log(this.appService.error)
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
