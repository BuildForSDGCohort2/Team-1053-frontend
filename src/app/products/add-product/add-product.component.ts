import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifications/notifier.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm = this.fb.group({
    name: [null, Validators.required],
    description: [null, Validators.required],
    price: [null, Validators.required],
    stock: [null, Validators.required],
    code: [null, Validators.required],
    image: [null, Validators.required],
    tags: [null, Validators.required],
  });

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.productForm.invalid) {
      console.log(this.productForm.value)
      // this.productService.addProduct(this.productForm.value).subscribe(
      //   res => {
      //     this.notifier.showNotification(res as string, 'OK', 'success');
      //   },
      //   err => {
      //     this.notifier.showNotification(err as string, 'OK', 'error');
      //   }
      // );
    }
  }

}
