import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Customer, OrderItem, ProductInterface } from 'src/app/models/app.model';
import { AppService } from 'src/app/services/app.service';
import { NotifierService } from 'src/app/services/notifications/notifier.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderItemsComponent } from '../order-items/order-items.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  orderItems: OrderItem[] = [];
  displayedColumns: string[] = ['product', 'price', 'quantity', 'cost', 'addItem'];
  itemsID: number[];
  productList: ProductInterface[];
  user: Customer = this.appService.currentCustomer;
  grandTotal;

  addressForm = this.fb.group({
    first_name: [this.user.first_name, Validators.required],
    last_name: [this.user.last_name, Validators.required],
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
    private notifierService: NotifierService
  ) {
    this.orderService.updateOderCost(null).subscribe(data => this.grandTotal = data as number);
   }
  ngOnInit() {
    this.orderService.getOrderItemList().subscribe(data => {
      this.orderItems = data as OrderItem[];
    });
    this.appService.getProducts().subscribe(res => this.productList = res as ProductInterface[]);
    this.appService.getCustomerProfile().subscribe();
    this.user = this.appService.currentCustomer;
  }

  onDeleteOrderItem(id: number, itemCost) {
    this.orderService.deleteOrderItem(id).subscribe(res => {
      const index = this.itemsID.indexOf(id);
      if (index > -1) {
        this.itemsID.splice(index, 1);
      }
      this.notifierService.showNotification(
        'Item Successfully deleted',
        'OK', 'success'
      );
      this.orderService.updateOderCost(-itemCost).subscribe(data => {
        this.grandTotal = data;
      });
      this.orderService.getOrderItemList().subscribe(data => {
        this.orderItems = data as OrderItem[];
      });

    });
  }

  onSubmit() {
    let data: any;
    data = this.addressForm.value;
    data.order_items = this.orderItems.map(item => item.id);
    this.orderService.saveOrder(data).subscribe(
      (res) => {
        this.notifierService.showNotification('Successfully placed an order', 'OK', 'success');
        this.router.navigate(['orders']);
      },
      (err) => {
        this.notifierService.showNotification(err.error.details, 'OK', 'error');
      }
    );
  }

  AddOrEditOrderItem(orderItemIndex, itemCost, OrderID) {
    const products = this.productList;
    const orderItems = this.orderItems;
    const itemsIDs = this.itemsID;
    const grandTotal = this.grandTotal;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '40rem';
    dialogConfig.panelClass = 'my-dialog-container-class';
    dialogConfig.data = { orderItemIndex, OrderID, products, orderItems, itemsIDs, grandTotal };
    this.dialog.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(res => {
      this.updateGrandTotal(itemCost, OrderID);
      this.orderService.getOrderItemList().subscribe(data => {
        this.orderItems = data as OrderItem[];
      });
    });
  }
  updateGrandTotal(itemCost, itemID) {
    if (itemCost !== null) {
      const item = this.orderItems.filter((item) => {
        return item.id === itemID;
      })[0];
      const update = item.cost - itemCost;
      this.orderService.updateOderCost(update).subscribe(data => {
        this.grandTotal = data;
      });
    } else {
      this.orderService.updateOderCost(null).subscribe(data => {
        console.log("dadada", data)
        this.grandTotal = data;
      });
    }
    return this.grandTotal;
  }


}
