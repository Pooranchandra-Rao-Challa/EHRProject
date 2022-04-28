import {
  Component,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'error-message',
  templateUrl: './error.message.component.html',
  styleUrls: ['./error.message.component.scss'],
})
export class ErrorMessageComponent{
  OperationMessage?: string;
  isError: boolean = false;
  onClose(){

  }
}
