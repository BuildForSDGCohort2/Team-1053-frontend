import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { StockInterface } from '../models/app.model';
import { ProductService } from '../services/product.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  stock: StockInterface[];

  constructor(
    private productService: ProductService,
    public auth: AppService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.productService.getStock().subscribe(
      (data: StockInterface[]) => {
        this.stock = data;
       }
    );
  }
}
