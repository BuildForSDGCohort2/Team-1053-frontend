import { DataSource } from '@angular/cdk/collections';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Customer } from 'src/app/models/app.model';


export interface HistoryElement {
    delivery_date: string;
    event: string;
    event_date: string;
    id: number;
    location: string;
    order_id: string;
    ship_to: Customer;
  }

export class OrderHistoryDataSource extends DataSource<HistoryElement> {

  constructor(public data: HistoryElement[] ) {
    super();

  }

  connect(): Observable<HistoryElement[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data)
    ];

    return merge(...dataMutations).pipe(map(() => {
      return [...this.data];
    }));
  }

  disconnect() { }

}
