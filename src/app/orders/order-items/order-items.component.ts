import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderItem, ProductInterface } from 'src/app/models/app.model';
import { NotifierService } from 'src/app/services/notifications/notifier.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styles: []
})
export class OrderItemsComponent implements OnInit {
  formData: any;
  isValid = true;
  productName: string;
  orderItem: OrderItem ;
  orderItems: OrderItem[];
  selectedProduct: ProductInterface;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemsComponent>,
    private storageService: LocalStorageService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    if (this.data.orderItemIndex === null) {
      this.formData = {
        product: this.data.id,
        product_name: this.productName,
        price: 0,
        quantity: 0,
        cost: 0
      };
    } else {
      this.formData = {
        product: this.data.orderItem.product,
        product_name: this.data.orderItem.product_name,
        price: this.data.orderItem.price_per_item,
        quantity: this.data.orderItem.quantity,
        cost: this.data.orderItem.cost
      };
    }
    this.storageService.getItem('orderItems').subscribe(item => {
      this.orderItems = JSON.parse(item) as [];
    });
  }

  updatePrice(ctrl) {
    if (ctrl.selectedIndex === 0) {
      this.formData.price = 0;
      this.formData.name = '';
    }
    else {
      this.formData.price = this.data.products[ctrl.selectedIndex - 1].price;
      this.formData.name = this.data.products[ctrl.selectedIndex - 1].name;
    }
    this.updateTotal();
  }

  updateTotal() {
    this.formData.cost = parseFloat((this.formData.quantity * this.formData.price).toFixed(2));
  }

  onSubmit(form: NgForm) {
    if (this.validateForm(form.value)) {
      if (this.data.orderItemIndex === null) {
        const product = this.data.products.find(
          item =>  item.id === parseInt(form.value.id, 10)
        );
        form.value.product_name = product.name;
        form.value.price_per_item = product.price;
        if (
          this.orderItems !== null && this.orderItems.some(item => item.id === form.value.id)
        ) {
          this.notifierService.showNotification(
            'Item Has already been added. Consider Updating', 'OK', 'error');
        } else {
          this.orderItems.push(form.value);
        }
      } else {
        const foundIndex = this.orderItems.findIndex(
          item => item.id === form.value.product_id
        );
        this.orderItems[foundIndex + 1] = form.value;
      }
      const totalCost = this.data.updateGrandTotal(this.orderItems);
      this.storageService.setItem('totalCost', JSON.stringify(totalCost));
      this.storageService.setItem('orderItems', JSON.stringify(this.orderItems));
      this.dialogRef.close();
    }
  }


  validateForm(formData: OrderItem) {
    this.isValid = true;
    if (formData.product === 0) {
      this.isValid = false;
    }
    else if (formData.quantity === 0) {
      this.isValid = false;
    }
    return this.isValid;
  }

}
