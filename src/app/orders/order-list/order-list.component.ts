import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { OrderListDataSource } from './order-list-datasource';
import { OrderService } from 'src/app/services/order.service';
import { OrderInterface } from 'src/app/models/app.model';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../delete-order/delete-dialog.component';
import { ViewOrderComponent } from '../view-order/view-order.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<OrderInterface>;
  dataSource: OrderListDataSource;

  /** Columns displayed in the table */
  displayedColumns = ['orderId', 'customer', 'dateCreated', 'cost', 'items', 'status', 'actions'];

  constructor(
    public orderService: OrderService,
    private router: Router,
    public dialog: MatDialog
  ) { }


  ngOnInit() {
    this.dataSource = new OrderListDataSource(this.orderService);
  }
  updateData() {
    this.dataSource = new OrderListDataSource(this.orderService);
  }

  onViewOrEditOrder(order: OrderInterface) {
    const dialogRef = this.dialog.open(ViewOrderComponent, {
      width: '40rem',
      data: order,
      position: {
        top: '10rem'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.updateData();
    });
  }

  onDeleteOrder(order: OrderInterface) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '30rem',
      data: order,
      position: {
        top: '10rem'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateData();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
