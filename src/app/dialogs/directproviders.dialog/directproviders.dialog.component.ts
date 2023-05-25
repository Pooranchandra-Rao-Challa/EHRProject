import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions } from 'src/app/_models';

@Component({
  selector: 'app-directproviders.dialog',
  templateUrl: './directproviders.dialog.component.html',
  styleUrls: ['./directproviders.dialog.component.scss']
})
export class DirectprovidersDialogComponent implements OnInit {
  title: string = "Direct Providers";
  showDirectProviders: boolean = false;
  ActionTypes = Actions;

  constructor(private ref: EHROverlayRef,
    public overlayService: OverlayService,) { }

  ngOnInit(): void {
  }

  onDirectProviders() {
    this.title = "New Message (Direct)";
    this.showDirectProviders = true;
  }

  cancel() {
    this.ref.close(null);
  }

  onUse(mail) {
    this.ref.close(mail);
  }

}
