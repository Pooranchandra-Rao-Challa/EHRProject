

import { Component} from '@angular/core'
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-encounter.note',
  templateUrl: './sign.encounter.note.component.html',
  styleUrls: ['./sign.encounter.note.component.scss']
})
export class SignEncounterNoteComponent{

  constructor(private overlayref: EHROverlayRef,){

  }
  close(){
    this.overlayref.close();
  }
  sign(){
    this.overlayref.close({'signed':true});
  }
}
