import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Customer } from 'src/app/models/app.model';
import { OrderService } from 'src/app/services/order.service';
import { HistoryElement, OrderHistoryDataSource } from './order-history-datasource';


@Component({
  selector: 'app-order-tracker',
  templateUrl: './order-tracker.component.html',
  styleUrls: ['./order-tracker.component.css']
})
export class OrderTrackerComponent implements  OnInit {

  trackerForm = this.fb.group({
    trackingId: [null, Validators.required],
  });

  customerDetails: Customer;
  historyData: HistoryElement[] = [];
  dataSource: OrderHistoryDataSource;

  displayedColumns = ['date', 'time', 'event', 'location', 'deliveryDate'];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService
  ) { }

  trackOrder() {
    this.orderService.getOrderHistory(this.trackerForm.value).subscribe(res => {
      this.historyData = res as HistoryElement[];
      this.customerDetails = this.historyData[0].ship_to;
      this.dataSource = new OrderHistoryDataSource(this.historyData);
    });
  }

  ngOnInit(): void {
  }

}
