import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService,
    private productService: ProductService
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete() {
    if (this.data.stock !== undefined) {
      this.productService.deleteProduct(this.data.id).subscribe(res => {
        console.log(res);
      });
    }
    else if (this.data.order_items !== undefined) {
      this.orderService.deleteOrder(this.data.id).subscribe(res => {
        console.log(res);
      });
    }
    
  }

  ngOnInit(): void {
  }

}

