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

  addressForm = this.fb.group({
    first_name: [this.user.user.first_name, Validators.required],
    last_name: [this.user.user.last_name, Validators.required],
    address: [this.user.address, Validators.required],
    mobile: [this.user.mobile, Validators.required],
    city: [this.user.city, Validators.required],
    street: [this.user.street, Validators.required],
    postalCode: [
      this.user.postal_code,
      Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
      ]),
    ],
    payment_option: ['Cash On Delivery', Validators.required],
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
  }

  onDeleteOrderItem(itemId: number) {
    this.orderItems.some(item => {
      if (item.id === itemId) {
        const index = this.orderItems.indexOf(item);
        if (index) {
          this.orderItems.splice(index, 1);
          this.storageService.setItem(
            'orderItems', JSON.stringify(this.orderItems)
          );
        }
        this.notifierService.showNotification(
        'Item Successfully deleted',
        'OK', 'success'
        );
      }
      this.storageService.getItem('orderItems').subscribe(orderItem => {
        this.orderItems = JSON.parse(orderItem) as [];
      });
      const totalCost = this.updateGrandTotal(this.orderItems);
      this.storageService.setItem('totalCost', JSON.stringify(totalCost));
    });
  }

  onSubmit() {
    let data: any;
    this.fields.map(field => this.addressForm.removeControl(field));
    data = this.addressForm.value;
    data.order_item = this.orderItems;
    console.log(data);
    if (data.order_item.length === 0) {
      this.notifierService.showNotification('Please add items to your order!', 'OK', 'error');
    } else {
      console.log(data);
      this.orderService.saveOrder(data).subscribe(
        () => {
          this.notifierService.showNotification('Successfully placed an order', 'OK', 'success');
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
  updateGrandTotal(items) {
    let totalCost = 0;
    items.forEach(item => {
      totalCost += item.cost;
    });
    return totalCost;
  }
}
