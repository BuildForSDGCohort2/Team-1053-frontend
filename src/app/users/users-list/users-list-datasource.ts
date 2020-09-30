import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Customer } from 'src/app/models/app.model';
import { AppService } from 'src/app/services/app.service';

export class UsersListDataSource extends DataSource<Customer> {
  data: Customer[];
  paginator: MatPaginator;
  sort: MatSort;

  constructor(private appService: AppService) {
    super();
    this.appService.getCustomers()
      .subscribe(arg => this.data = arg as Customer[]);
  }

  connect(): Observable<Customer[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  disconnect() {}

  private getPagedData(data: Customer[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: Customer[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.first_name, b.first_name, isAsc);
        case 'joined': return compare(+a.user.joined, +b.user.joined, isAsc);
        case 'lastLogin': return compare(+a.user.lastLogin, +b.user.lastLogin, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
