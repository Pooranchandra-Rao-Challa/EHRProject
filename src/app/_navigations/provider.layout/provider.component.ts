import { Component, OnInit } from '@angular/core';
import { LocationSelectService,ViewChangeService } from './view.notification.service';

@Component({ templateUrl: 'provider.component.html' })
export class ProviderComponent implements OnInit {
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
