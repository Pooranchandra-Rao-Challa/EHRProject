import { DrfirstService } from '../../_services/drfirst.service';
import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';


@Component({
  selector: 'app-e-prescribe.dialog',
  templateUrl: './dr-first.dialog.component.html',
  styleUrls: ['./dr-first.dialog.component.scss']
})
export class DrFirstDialogComponent implements OnInit {

  constructor(
    private ref: EHROverlayRef
    ,private drfirstService: DrfirstService) { }

  ngOnInit(): void {
  }

  cancel() {
    this.ref.close(null);
  }

  sendPatientDrfirstRegistration(){
    //this.drfirstService.SendPatient()
  }
}
