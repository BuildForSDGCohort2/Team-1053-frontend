import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service';
import { OrderItem, ProductInterface } from 'src/app/models/app.model';
import { NotifierService } from 'src/app/services/notifications/notifier.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styles: []
})
export class OrderItemsComponent implements OnInit {
  formData: any;
  isValid = true;
  orderItem: OrderItem;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemsComponent>,
    private orderService: OrderService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    if (this.data.orderItemIndex === null) {
      this.formData = {
        id: this.data.id,
        name: '',
        price: 0,
        quantity: 0,
        cost: 0
      };
    } else {
      const orderItem = this.data.orderItems.filter((item) => item.id === this.data.OrderID)[0];
      this.formData = {
        id: this.data.OrderID,
        name: orderItem.item,
        price: orderItem.price_per_item,
        quantity: orderItem.quantity,
        product: orderItem.product,
        cost: orderItem.cost
      };
    }
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
        if (
          this.data.orderItems.some(item => item.product === form.value.product || item.product == form.value.id)
        ) {
          this.notifierService.showNotification(
            'Item Has already been added. Consider Updating', 'OK', 'error');
        } else {
          this.orderService.saveOrderItem(form.value).subscribe(
            response => {
              if (!response) {
                this.notifierService.showNotification(
                  this.orderService.error, 'OK', 'error'
                );
              } else {
                this.orderItem = response as OrderItem;
              }
          });
        }
      } else {
        this.orderService.updateOrderItem(form.value, this.data.OrderID).subscribe(res => {
          // this.data.grandTotal -= this.orderItem.cost;
          console.log('prev', this.orderItem);
          this.orderItem = res as OrderItem;
          console.log(this.orderItem);
          this.notifierService.showNotification('Item updated', 'OK', 'success');
        });
      }
      this.dialogRef.close();
    }
  }

  validateForm(formData: OrderItem) {
    this.isValid = true;
    if (formData.id === 0) {
      this.isValid = false;
    }
    else if (formData.quantity === 0) {
      this.isValid = false;
    }
    return this.isValid;
  }

}
