/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IpServiceService } from './ip.service.service';

describe('Service: IpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IpServiceService]
    });
  });

  it('should ...', inject([IpServiceService], (service: IpServiceService) => {
    expect(service).toBeTruthy();
  }));
});
