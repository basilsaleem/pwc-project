import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

   simpleNotification(message: string): void{
    Swal.fire(message);
  }

  public successNotification(message: string): void{
    Swal.fire('Success', message, 'success');
  }

  errorNotification(message: string): void{
    Swal.fire('Error', message, 'error');
  }

  alertConfirmation(message: string): void{
    Swal.fire({
      position: 'top-end',
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Removed!',
          'Item removed successfully.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Item is safe.)',
          'error'
        );
      }
    });
  }

}
