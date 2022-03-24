import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocationSelectService } from './location.service';
@Component({ templateUrl: 'provider.component.html' })
export class ProviderComponent {
  constructor(
    private router: Router,
    private locationSelectService : LocationSelectService
  ) {


  }
  locationChanged(locationId){
    console.log(locationId);
    this.locationSelectService.sendData(locationId);

  }
  ngOnDestroy(){
    // clear message
    this.locationSelectService.clearData();
}

  clearData(){
    // clear message
      this.locationSelectService.clearData();
  }
}
