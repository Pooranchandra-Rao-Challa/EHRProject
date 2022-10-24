import { Component, Injectable, OnInit } from '@angular/core';
import { PatientService } from 'src/app/_services/patient.service';

@Component({
  selector: 'provider-app-footer',
  templateUrl: './provider.footer.component.html',
  styleUrls: ['./provider.footer.component.scss']
})
@Injectable({
  providedIn: 'root'
})

export class ProviderFooterComponent implements OnInit {
providerFooterVersion:any[]
  constructor(private patientservice:PatientService) { }

  ngOnInit() {
    this.GetAdminSettingVersion();
  }
  GetAdminSettingVersion()
  {
   this.patientservice.ChangeFooterVersion().subscribe(resp=>
  {
    if(resp.IsSuccess)
    {
      this.providerFooterVersion = resp.ListResult;
    }
  })
  }
}
