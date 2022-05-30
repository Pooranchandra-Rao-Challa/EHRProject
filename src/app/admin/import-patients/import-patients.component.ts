import { Component } from '@angular/core';
import { Query } from '@syncfusion/ej2-data';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-import-patients',
  templateUrl: './import-patients.component.html',
  styleUrls: ['./import-patients.component.scss']
})
export class ImportPatientsComponent {

  ProviderList: any = [];

  constructor(private adminservice: AdminService) { }

  ngOnInit(): void {
    this.GetProviderNameList();
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
        console.log(this.ProviderList);
      }
    });
  }
}



