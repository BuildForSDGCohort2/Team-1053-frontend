import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { OrderInterface } from 'src/app/models/app.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ViewOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderInterface,
    private orderService: OrderService,
    formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  updateOrder() {
    const data = {};
    this.orderService.updateOrder(this.data.id, data).subscribe(res => console.log(res)
    );
  }

  onClose(): void { 
    this.dialogRef.close();
  }

}
