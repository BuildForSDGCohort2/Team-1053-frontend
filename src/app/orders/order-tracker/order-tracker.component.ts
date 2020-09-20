import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-tracker',
  templateUrl: './order-tracker.component.html',
  styleUrls: ['./order-tracker.component.css']
})
export class OrderTrackerComponent implements OnInit {
  trackerForm = this.fb.group({
    trackingId: [null, Validators.required],
  });

  constructor(private fb: FormBuilder) { }

  trackOrder() {
    alert('Order tracked');
  }

  ngOnInit(): void {
  }

}
