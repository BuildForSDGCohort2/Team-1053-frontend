import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ProductInterface } from 'src/app/models/app.model';
import { AppService } from 'src/app/services/app.service';
import { ProductService } from 'src/app/services/product.service';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  productsList: ProductInterface[];
  pagedList: ProductInterface[] = [];
  breakpoint: number;
  length: number;
  pageSize = 6;  // displaying eight cards each row
  pageSizeOptions: number[] = [6, 12, 15, 18];
  term: string;
  hasValue: boolean;

  constructor(
    private productService: ProductService,
    public auth: AppService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 800) ? 1 : 3;
    this.productService.getProducts().subscribe(data => {
      this.productsList = data as ProductInterface[];
      this.pagedList = this.productsList.slice(0, 6);
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
    this.breakpoint = (event.target.innerWidth <= 800) ? 1 : 3;
  }

  openAddProductDialog() {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '45rem',
      position: {
        top: '1rem'
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.productService.getProducts().subscribe(data => {
        this.productsList = data as ProductInterface[];
        this.pagedList = this.productsList.slice(0, 6);
        this.length = this.productsList.length;
      });
    });
  }

  onViewProduct(product: ProductInterface) {
    const dialogRef = this.dialog.open(ProductDetailsComponent, {
      width: '40rem',
      data: product,
      position: {
        top: '10rem'
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.productService.getProducts().subscribe(data => {
        this.productsList = data as ProductInterface[];
        this.pagedList = this.productsList.slice(0, 8);
        this.length = this.productsList.length;
      });
    });
  }
  onDeleteProduct(product: ProductInterface) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '30rem',
      data: product,
      position: {
        top: '10rem'
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.productService.getProducts().subscribe(data => {
        this.productsList = data as ProductInterface[];
        this.pagedList = this.productsList.slice(0, 8);
        this.length = this.productsList.length;
      });
    });
  }
  backgroundStyle(url) {
    return {
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'background-size': 'cover',
      'background-image': `url(${url})`
    };
 }

  // Clear term types by user
  clearFilter() {
    this.term = '';
  }

}
