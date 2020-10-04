import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer, User } from 'src/app/models/app.model';
import { NotifierService } from 'src/app/services/notifications/notifier.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { AppService } from 'src/app/services/user/app.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  public user: User;
  public customer: Customer;
  multiple = false;
  displayPasswordField = false;
  accept: string;
  readonly maxSize = 16;
  contactForm: FormGroup;
  infoForm: FormGroup;
  hide = true;

  // Password form
  passwordForm = this.fb.group({
    new_password1: ['',
    Validators.compose([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
      Validators.pattern('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/')
    ]),
    ],
    new_password2: ['',
    Validators.compose([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
      Validators.pattern('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/')
    ]),
    ],
    old_password: ['', Validators.required],
  });



  constructor(
    private fb: FormBuilder,
    public appService: AppService,
    private notifier: NotifierService,
    private storageService: LocalStorageService,
    private router: Router
  ) {}
  ngOnInit() {
    this.storageService.getItem('currentUser').subscribe(
      user => this.user = JSON.parse(user)
    );
    // Basic information form
    this.infoForm = this.fb.group({
      username: [this.user.username, Validators.required],
      email: [this.user.email, Validators.required],
      first_name: [this.user.first_name, Validators.required],
      last_name: [this.user.last_name, Validators.required],
    });
    // Contact form
    this.contactForm = this.fb.group({
      user: this.user.id,
      address: [
        this.customer ? this.customer.address : '',
        Validators.required
      ],
      phone: [
        this.customer ? this.customer.mobile : '',
        Validators.required
      ],
      city: [
        this.customer ? this.customer.city : '',
        Validators.required
      ],
      street: [
        this.customer ? this.customer.street : '',
        Validators.required
      ],
      postal_code: [
        '',
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
    this.appService.getCustomerProfile().subscribe(
      res => this.storageService.setItem(
        'currentCustomer', JSON.stringify(res)
      )
    );
    this.storageService.getItem('currentCustomer').subscribe(
      customer => this.customer = JSON.parse(customer)
    );

  }
  // update basic info
  updateBasicInfo() {
    if (this.infoForm.valid) {
      this.appService
      .updateUser(this.infoForm.value)
      .subscribe((res) => {
        if (!res) {
          this.notifier.showNotification(this.appService.error, 'OK', 'error');
        } else {
          this.notifier.showNotification(
            'Basic Information Updated. Update Contact Information',
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

  // change user password
  changePassword() {
    this.appService.changeUserPassword(this.passwordForm.value).subscribe(
      res => { },
      err => { }
    );
  }

  // update contact info
  updateContactInfo() {
    this.appService.updateContactInfo(this.contactForm.value).subscribe(
      (res) => {
        this.storageService.setItem('currentCustomer', JSON.stringify(res));
        this.notifier.showNotification(
          'Contact Information Updated Successfully',
          'OK',
          'success'
        );
        this.router.navigate(['new-order']);
      },
      (err) => {
        this.notifier.showNotification(
          'The was error, Please check your connection settings',
          'OK',
          'error'
        );
      }
    );
    this.storageService.getItem('currentCustomer').subscribe(
      customer => this.customer = JSON.parse(customer)
    );
  }
}
