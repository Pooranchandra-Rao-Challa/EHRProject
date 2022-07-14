import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-odermanualentrydialog',
  templateUrl: './odermanualentrydialog.component.html',
  styleUrls: ['./odermanualentrydialog.component.scss']
})
export class OdermanualentrydialogComponent implements OnInit {

  constructor(private ref: EHROverlayRef,) { }

  ngOnInit(): void {
  }
  cancel() {
    this.ref.close(null);
  }
}
