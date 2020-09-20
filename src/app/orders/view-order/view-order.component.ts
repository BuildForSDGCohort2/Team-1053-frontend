import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { OrderedItem, OrderInterface } from 'src/app/models/app.model';
import { OrderService } from 'src/app/services/order.service';
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

  constructor(
    public dialogRef: MatDialogRef<ViewOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderInterface,
    private orderService: OrderService,
    formBuilder: FormBuilder
  ) {}

  ngOnInit(): void { 
    this.dataSource = new OrderItemsDataSource(
      this.data.order_items as OrderedItem[]);
    console.log(this.dataSource)
  }

  cancelOrder() {
    this.data.status = 'Canceled';
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

