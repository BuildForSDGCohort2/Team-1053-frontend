import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { OrderedItem, OrderInterface } from 'src/app/models/app.model';
import { OrderService } from 'src/app/services/order/order.service';
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
  orderForm = this.fb.group({
    order_id: [this.data.order_id],
    status: [this.data.status],
    order_items: [this.data.orderitem_set],
    payment_option: [this.data.payment_option]
  });


  constructor(
    public dialogRef: MatDialogRef<ViewOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderInterface,
    private orderService: OrderService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dataSource = new OrderItemsDataSource(
      this.data.orderitem_set as OrderedItem[]);
  }

  updateOrder(data: object) {
    const updates = data !== null ? data : this.orderForm.value;
    this.data = { ...this.data, ...updates };
    this.orderService.updateOrder(this.data.id, this.data).subscribe(res => console.log(res)
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

