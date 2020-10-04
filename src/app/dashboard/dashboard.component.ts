import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { OrderService } from '../services/order/order.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  range = this.fb.group({
    start: [null, Validators.required],
    end: [null, Validators.required]
  });
  /** Based on the screen size, switch from standard to one column per row */
  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 1,
          miniCard: {cols: 1, rows: 1},
          chart: {cols: 1, rows: 2},
          table: {cols: 1, rows: 4}
        };

      }

      return {
        columns: 4,
        miniCard: {cols: 1, rows: 1},
        chart: {cols: 2, rows: 2},
        table: {cols: 4, rows: 4}
      };
    })
  );
  summary;
  summaryData: any[];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private orderService: OrderService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.orderService.orderSummary().subscribe((data) => {
      this.summary = data;
      this.summaryData = [
        {
          title: 'Total Spending',
          value: this.summary.total_cost,
          isIncrease: true,
          color: 'primary',
          percentValue: this.summary.total_cost / this.summary.average_cost,
          icon: 'payments',
          isCurrency: true
        },
        {
          title: 'Average Order Value',
          value: this.summary.average_cost,
          isIncrease: false, color: 'accent',
          percentValue: this.summary.average_cost * 0.0001,
          icon: 'local_atm', isCurrency: true
        },
        {
          title: 'Total Orders',
          value: this.summary.orders,
          isIncrease: true,
          color: 'warn', percentValue: 0.1,
          icon: 'shopping_cart', isCurrency: false
        },
        {
          title: 'Delivered Orders',
          value: this.summary.delivered.length,
          isIncrease: false, color: 'primary',
          percentValue: 0, icon: 'move_to_inbox',
          isCurrency: false
        }
      ];
    }
    );
  }
}
