

import { Component} from '@angular/core'
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AddendaDoc } from 'src/app/_models/_provider/encounter';

@Component({
  selector: 'app-addenda-sign.note',
  templateUrl: './attenda.document.sign.component.html',
  styleUrls: ['./attenda.document.sign.component.scss']
})
export class SignAddendaDocumentComponent{

  constructor(private overlayref: EHROverlayRef,){

  }
  close(){
    this.overlayref.close();
  }
  sign(){
    this.overlayref.close({'Signed':true,'Addenda': this.overlayref.RequestData as AddendaDoc});
  }
}
