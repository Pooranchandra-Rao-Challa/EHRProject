
import { Component } from '@angular/core';
import { LocationSelectService, ViewChangeService } from '../provider.layout/view.notification.service';


@Component({ templateUrl: 'patient.component.html' })
export class PatientComponent {
  constructor(
    private locationSelectService: LocationSelectService,
    private viewChagneService: ViewChangeService,
  ) {
  }

  ngOnInit() {
  }
  locationChanged(locationId) {
    this.locationSelectService.sendData(locationId);
  }
  ngOnDestroy() {
    // clear message
    this.locationSelectService.clearData();
    this.viewChagneService.clearData();
  }
  UpdateBredcrum(view){
    this.viewChagneService.sendData(view);
  }
}
