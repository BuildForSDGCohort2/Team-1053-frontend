import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ProductInterface } from 'src/app/models/app.model';
import { AppService } from 'src/app/services/app.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-card',
  templateUrl: './products-card.component.html',
  styleUrls: ['./products-card.component.css']
})
export class ProductsCardComponent implements OnInit {
  @Input() stock: number;

  productsList: ProductInterface[];
  pagedList: ProductInterface[] = [];
  breakpoint: number;
  length: number;
  pageSize = 4;  // displaying eight cards each row
  pageSizeOptions: number[] = [8, 12, 15, 18];


  constructor(
    private productService: ProductService,
    public auth: AppService,
  ) { }

  ngOnInit() {
    console.log(this.stock)
    this.breakpoint = (window.innerWidth <= 800) ? 1 : 4;
    this.productService.getProducts().subscribe(data => {
      this.productsList = data as ProductInterface[];
      this.pagedList = this.productsList.filter(product => product.stock == this.stock).slice(0, 4);
      this.length = this.productsList.length;
    });
  }
  OnPageChange(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.length){
      endIndex = this.length;
    }
    this.pagedList = this.productsList.slice(startIndex, endIndex);
  }

  onResize(event) { // to adjust to screen size
    this.breakpoint = (event.target.innerWidth <= 800) ? 1 : 4;
  }
}
