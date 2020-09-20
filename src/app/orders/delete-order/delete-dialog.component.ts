import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { OrderInterface } from 'src/app/models/app.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderInterface,
    private orderService: OrderService
  ) { }

  onCancel(): void { 
    this.dialogRef.close();
  }

  onDelete(orderId: number) {
    this.orderService.deleteOrder(this.data.id).subscribe(res => {
      console.log(res);
    });
  }

  ngOnInit(): void {
  }

}
