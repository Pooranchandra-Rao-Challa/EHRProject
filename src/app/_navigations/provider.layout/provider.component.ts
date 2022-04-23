import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationSelectService } from './location.service';
import{ OverlayService} from '../../overlay.service'

@Component({ templateUrl: 'provider.component.html' })
export class ProviderComponent implements OnInit {
  constructor(
    private router: Router,
    private locationSelectService: LocationSelectService,
    //private overlayservice: OverlayService
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
  }

  clearData() {
    // clear message
    this.locationSelectService.clearData();
  }
}
