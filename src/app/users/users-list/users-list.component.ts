import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Customer } from 'src/app/models/app.model';
import { AppService } from 'src/app/services/app.service';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';
import { UsersListDataSource } from './users-list-datasource';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Customer>;
  dataSource: UsersListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'email', 'phone', 'joined', 'lastLogin', 'options'];

  constructor(
    public appService: AppService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSource = new UsersListDataSource(this.appService);
  }

  onViewCustomer(customer: Customer) {
    const dialogRef = this.dialog.open(CustomerDetailComponent, {
      width: '40rem',
      data: customer,
      position: {
        top: '10rem'
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSource = new UsersListDataSource(this.appService);
    });
  }
  onDeleteCustomer(customer: Customer) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '30rem',
      data: customer,
      position: {
        top: '10rem'
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.dataSource = new UsersListDataSource(this.appService);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
