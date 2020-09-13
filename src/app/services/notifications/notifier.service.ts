import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(private snackBar: MatSnackBar) { }

  showNotification(displayMessage: string, button: string, messageType: 'error' | 'success') {
    this.snackBar.openFromComponent(NotificationComponent, {
      data: {
        message: displayMessage,
        buttonText: button,
        type: messageType
      },
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
