import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { OrderedItem, OrderInterface } from 'src/app/models/app.model';
import { OrderService } from 'src/app/services/order/order.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { OrderItemsDataSource } from './order-items-datasource';


@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<OrderedItem>;
  dataSource: OrderItemsDataSource;
  displayedColumns = ['id', 'item', 'price_per_item', 'quantity', 'cost'];
  currentUser;
  statuses: string[] = [
    'On Hold', 'Confirmed', 'Canceled', 'Packed', 'Dispatched', 'Out for delivery', 'Delivered'
  ];
  orderForm = this.fb.group({
    order_id: [this.data.order_id],
    status: [this.data.status],
    order_items: [this.data.orderitem_set],
    payment_option: [this.data.payment_option]
  });
  selectedValue: string;


  constructor(
    public dialogRef: MatDialogRef<ViewOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderInterface,
    private orderService: OrderService,
    private fb: FormBuilder,
    private storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.dataSource = new OrderItemsDataSource(
      this.data.orderitem_set as OrderedItem[]);
    this.storage.getItem('currentUser').subscribe(user => {
      this.currentUser = JSON.parse(user);
    });
  }

  updateOrder(data: object) {
    const updates = data !== null ? data : this.orderForm.value;
    this.data = { ...this.data, ...updates };
    this.orderService.updateOrder(this.data.id, this.data).subscribe(res => console.log(res)
    );
  }

  updateStatus(value: string) {
    const data = { status: value };
    this.orderService.updateOrder(this.data.id, data).subscribe(res => this.data = res as OrderInterface
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

}

