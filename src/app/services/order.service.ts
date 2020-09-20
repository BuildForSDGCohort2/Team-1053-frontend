import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { baseUrl } from 'src/environments/environment';
import { OrderInterface, OrderItem } from '../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  error: any;
  orderItems: OrderItem[];
  orderItemsIDs = parseInt(localStorage.getItem('orderItemsIDs'), 10);
  grandTotal = localStorage.getItem('grandTotal') === null ? 0 : parseInt(localStorage.getItem('grandTotal'), 10);
  totalCost = 0;
  token: string = localStorage.getItem('token');
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // tslint:disable-next-line: object-literal-key-quotes
      'Authorization': `Token ${this.token}`
    })
  };

  constructor(private http: HttpClient) { }

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
          this.grandTotal += data.cost;
          localStorage.setItem('grandTotal', this.grandTotal.toString());
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

  updateOderCost(upDate): Observable<number> {
    if (upDate === null) {
      return of(this.grandTotal);
    }else{
      let newValue = this.grandTotal + upDate;
      if (newValue < 0) {
        newValue = 0;
      }
      localStorage.setItem('grandTotal', newValue.toString());
      return of(this.grandTotal);
    }
  }
}
