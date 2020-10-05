import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Customer, OrderItem, ProductInterface } from 'src/app/models/app.model';
import { ProductService } from 'src/app/services/inventory/product.service';
import { NotifierService } from 'src/app/services/notifications/notifier.service';
import { OrderService } from 'src/app/services/order/order.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { AppService } from 'src/app/services/user/app.service';
import { OrderItemsComponent } from '../order-items/order-items.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  orderItems: OrderItem[];
  displayedColumns: string[] = ['product', 'price', 'quantity', 'cost', 'addItem'];
  itemsID: number[];
  productList: ProductInterface[];
  user: Customer = this.appService.currentCustomer;
  product: ProductInterface;
  grandTotal;
  fields = ['first_name', 'last_name', 'address', 'mobile', 'city', 'street', 'postalCode'];
  options = [
    'Cash On Delivery',
    'Paypal',
    'Credit Card'
  ];

  addressForm = this.fb.group({
    first_name: [this.user.user.first_name],
    last_name: [this.user.user.last_name],
    address: [this.user.address],
    mobile: [this.user.mobile],
    city: [this.user.city],
    street: [this.user.street],
    postalCode: [this.user.postal_code],
    payment_option: ['', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrderService,
    private dialog: MatDialog,
    private appService: AppService,
    private storageService: LocalStorageService,
    private productService: ProductService,
    private notifierService: NotifierService
  ) {}
  ngOnInit() {
    this.storageService.setItem('orderItems', JSON.stringify([]));
    this.productService.getProducts().subscribe(res => this.productList = res as ProductInterface[]);
    this.appService.getCustomerProfile().subscribe();
    this.user = this.appService.currentCustomer;
    this.storageService.getItem('orderItems').subscribe(item => {
      this.orderItems = JSON.parse(item) as [];
    });
    this.storageService.getItem('orderItems').subscribe(item => {
      this.orderItems = JSON.parse(item) as [];
    });
    this.storageService.getItem('totalCost').subscribe(item => {
      this.grandTotal = JSON.parse(item) as number;
    });

    // disable some form fields
    this.fields.forEach(field => this.addressForm.controls[field].disable());
  }

  onDeleteOrderItem(itemId: number) {
    const items = [];
    this.orderItems.map(item => {
      if (item.id !== itemId) {
        console.log('item', item);
        items.push(item);
      }
    });
    this.storageService.setItem('orderItems', JSON.stringify(items));
    const totalCost = this.updateGrandTotal(items);
    this.storageService.setItem('totalCost', JSON.stringify(totalCost));
    this.storageService.getItem('orderItems').subscribe(
      orderItem => { this.orderItems = JSON.parse(orderItem) as []; });
    this.storageService.getItem('totalCost').subscribe(
      cost => {this.grandTotal = JSON.parse(cost) as number;
      });
    this.notifierService.showNotification(
        'Item Successfully deleted',
        'OK', 'success'
        );
  }

  onSubmit() {
    if (this.orderItems.length === 0) {
      this.notifierService.showNotification('Please add items to your order!', 'OK', 'error');
    } else {
      const items = this.orderItems;
      items.map(item => this.deleteField(item));
      const data = {
        items: this.orderItems,
        payment_option: this.addressForm.value.payment_option
      };
      this.orderService.saveOrder(data).subscribe(
        () => {
          this.notifierService.showNotification('Successfully placed an order', 'OK', 'success');
          this.storageService.setItem('orderItems', JSON.stringify([]));
          this.storageService.setItem('totalCost', JSON.stringify(0));
          this.router.navigate(['orders']);
        },
        (err) => {
          this.notifierService.showNotification(err.error.details, 'OK', 'error');
        }
      );
    }
  }

  AddOrEditOrderItem(orderItemIndex, orderItem) {
    const products = this.productList;
    const updateGrandTotal = this.updateGrandTotal;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '40rem';
    dialogConfig.panelClass = 'my-dialog-container-class';
    dialogConfig.data = { orderItemIndex, orderItem, products, updateGrandTotal, };
    this.dialog.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(() => {
      this.storageService.getItem('orderItems').subscribe(item => {
        this.orderItems = JSON.parse(item) as [];
      });
      this.storageService.getItem('totalCost').subscribe(item => {
        this.grandTotal = JSON.parse(item) as number;
      });
    });
  }
  deleteField(object: OrderItem) {
    const fields = ['product_name', 'price', 'price_per_item'];
    fields.map(field => delete object[field]);
    object.product = object.id;
    delete object.id;
    return object;
  }

  updateGrandTotal(items: Array<OrderItem>) {
    let totalCost = 0;
    items.forEach(item => {
      totalCost += item.cost;
    });
    return totalCost;
  }
}
