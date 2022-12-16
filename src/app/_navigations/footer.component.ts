import { Component, OnInit } from '@angular/core';
import { PatientService } from '../_services/patient.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  providerFooterVersion: any[]

  constructor(private patientservice: PatientService) { }

  ngOnInit() {
    this.GetAdminSettingVersion();
  }

  GetAdminSettingVersion() {
    this.patientservice.ChangeFooterVersion().subscribe(resp => {
      if (resp.IsSuccess) {
        this.providerFooterVersion = resp.ListResult;
      }
    });
  }

}
