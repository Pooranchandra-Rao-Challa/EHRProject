import { Component } from '@angular/core';
import { Query } from '@syncfusion/ej2-data';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { AdminService } from 'src/app/_services/admin.service';
import { PatientService } from 'src/app/_services/patient.service';
import { ProviderList } from 'src/app/_models/_admin/providerList';

@Component({
  selector: 'app-import-encounters',
  templateUrl: './import-encounters.component.html',
  styleUrls: ['./import-encounters.component.scss']

})
export class ImportEncountersComponent {

  ProviderList: any = [];
  SourceOfPaymentTypologyCodes: any = [];
  SourceOfPaymentTypologyCodesFilter: any;
  primlist: ProviderList = {} as ProviderList;
  secondarySptcFilter:any;

  constructor(private adminservice: AdminService,
    private patientservice: PatientService,) {
      this.primlist = {} as ProviderList;
    }

  ngOnInit(): void {
    this.GetProviderNameList();
    // this.getSourceOfPaymentTypologyCodesDD();
  }

  ProviderName: Object = { text: 'ProviderName', value: 'ProviderId' };

  FilteringProviderName: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('ProviderName', 'startswith', e.text, true) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.ProviderList, query);
  }

  GetProviderNameList() {
    this.adminservice.GetProviderList().subscribe(resp => {
      if (resp.IsSuccess) {
        this.ProviderList = resp.ListResult;
        this.SourceOfPaymentTypologyCodesFilter=this.ProviderList.slice();
        this.secondarySptcFilter=this.ProviderList.slice();
      }
    });
  }
}
