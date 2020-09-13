import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { NotifierService } from '../services/notifications/notifier.service';
import { AppService } from '../services/app.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ProductInterface, StockInterface } from '../models/app.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  stock: StockInterface[];
  products: ProductInterface[];

  constructor(
    public appService: AppService,
    private notifierService: NotifierService,
    public breakpointObserver: BreakpointObserver
  ) { }
  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(({ matches }) => {
        if (matches) {
        return {
            columns: 1,
            table: { cols: 1, rows: 2 },
        };
        }
        return {
        columns: 4,
        table: { cols: 4, rows: 2 },
        };
    })
    );
  ngOnInit() {
    this.appService.getStock().subscribe(
      (data: StockInterface[]) => {
        this.stock = data;
       }
    );
  }
}
