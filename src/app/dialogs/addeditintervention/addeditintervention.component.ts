import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-addeditintervention',
  templateUrl: './addeditintervention.component.html',
  styleUrls: ['./addeditintervention.component.scss']
})
export class AddeditinterventionComponent implements OnInit {

  constructor(private ref: EHROverlayRef) { }

  ngOnInit(): void {
  }

  cancel(){
    this.ref.close(null);
  }
}
