import Swal from 'sweetalert2';

export class AlertMessage {

  constructor() { }

  displayMessageDailog(message) {
    Swal.fire({
      title: message,
      showConfirmButton: true,
      confirmButtonText: 'Close',
      width: '700'
    });
  }
}
