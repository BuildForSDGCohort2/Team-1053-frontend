import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { baseUrl } from 'src/environments/environment';
import { OrderItem } from '../../models/app.model';
import { AppService } from '../user/app.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  error: any;
  orderItems: OrderItem[];
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // tslint:disable-next-line: object-literal-key-quotes
      'Authorization': `Token ${this.authService.token}`
    })
  };

  constructor(private http: HttpClient, private authService: AppService) { }

  saveOrder(data: any) {
    return this.http.post(`${baseUrl}orders/`, data, this.options);
  }

  getOrderList() {
    return this.http.get(`${baseUrl}orders/`, this.options);
  }

  getOrderByID(id: number) {
    return this.http.get(`${baseUrl}orders/${id}/`, this.options);
  }

  updateOrder(id: number, data: any) {
    return this.http.put(`${baseUrl}orders/${id}/`, data, this.options);
  }

  deleteOrder(id: number) {
    return this.http.delete(`${baseUrl}orders/${id}/`, this.options);

  }

  getOrderItemList(){
    return this.http.get(`${baseUrl}order-items/`, this.options)
      .pipe(
        tap(response => {
          return response;
        })
      );
  }

  getOrderItem(id: number){
    return;
  }

  saveOrderItem(data: any) {
    const payload = {
      // tslint:disable-next-line: radix
      product: parseInt(data.id),
      quantity: data.quantity
    };
    return this.http.post(`${baseUrl}order-items/`, payload, this.options)
      .pipe(
        tap(response => {
          return response as OrderItem;
        })
    )
    .pipe(catchError(err => {
      this.error = err.error;
      return of(false);
    }));
  }

  updateOrderItem(data: any, itemId) {
    data.product = typeof data.id === 'string' ? parseInt(data.id, 10) : data.product;
    return this.http.put(`${baseUrl}order-items/${itemId}/`, data, this.options)
      .pipe(
        tap(response => {
          console.log(response);
          return response as OrderItem;
        })
    )
    .pipe(catchError(err => {
      this.error = err.error;
      return of(false);
    }));
  }

  deleteOrderItem(itemId: number){
    return this.http.delete(`${baseUrl}order-items/${itemId}/`, this.options);
  }

  getOrderHistory(data) {
    return this.http.get(`${baseUrl}order-history/${data.trackingId}`, this.options);
  }

  orderSummary() {
    return this.http.get(`${baseUrl}order-summary`, this.options);
  }
}
