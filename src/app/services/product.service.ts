import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment';
import { ProductInterface } from '../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  token: string = localStorage.getItem('token');
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // tslint:disable-next-line: object-literal-key-quotes
      'Authorization': `Token ${this.token}`
    })
  };

  constructor(private http: HttpClient) { }

  getProducts() {
    // get all products from the server
    return this.http.get(`${baseUrl}products/`);
  }
  addProduct(data: ProductInterface) {
    // add product to the server
    return this.http.post(`${baseUrl}products/`, data, this.options);
  }

  getStock() {
    // get all stock from the server
    return this.http.get(`${baseUrl}stock/`);
  }
}

