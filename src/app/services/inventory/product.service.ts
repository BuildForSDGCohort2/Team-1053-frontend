import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from 'src/environments/environment';
import { ProductInterface } from '../../models/app.model';
import { AppService } from '../user/app.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // tslint:disable-next-line: object-literal-key-quotes
      'Authorization': `Token ${this.authService.token}`
    })
  };

  constructor(private http: HttpClient, private authService: AppService) { }

  getProducts() {
    // get all products from the server
    return this.http.get(`${baseUrl}products/`);
  }
  addProduct(data: ProductInterface) {
    const options = {
      headers: new HttpHeaders({
        Authorization: `Token ${this.authService.token}`
      })
    };
    // add product to the server
    return this.http.post(`${baseUrl}products/`, this.getFormData(data), options);
  }

  deleteProduct(productId: number) {
    // delete product from the server
    return this.http.delete(`${baseUrl}products/${productId}`, this.options);
  }
  getStock() {
    // get all stock from the server
    return this.http.get(`${baseUrl}stock/`, this.options);
  }

  getTags() {
    // get all tags from the server
    return this.http.get(`${baseUrl}tags/`, this.options);
  }

  getFormData = object => Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
  }, new FormData())
}

