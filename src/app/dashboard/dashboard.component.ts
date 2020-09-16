import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
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
  summaryData = [
    { title: 'Total Spending', value: '9465', isIncrease: true, color: 'primary', percentValue: '0.5383', icon: 'payments', isCurrency: true },
    { title: 'Average Order Value', value: '465', isIncrease: false, color: 'accent', percentValue: '0.2544', icon: 'local_atm', isCurrency: true },
    { title: 'Total Orders', value: '243', isIncrease: true, color: 'warn', percentValue: '0.4565', icon: 'shopping_cart', isCurrency: false },
    { title: 'Delivered Orders', value: '35', isIncrease: false, color: 'primary', percentValue: '0.8361', icon: 'move_to_inbox', isCurrency: false }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}
}
