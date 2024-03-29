import { Component } from '@angular/core';
import { ProviderList } from '../../_models/_admin/providerList';
import { AdminService } from '../../_services/admin.service';

class FilterOprions{
  ActiveProvider: boolean = true
  InactiveProvider: boolean = false;
  PaidProvider: boolean = false;
  TrailProvider: boolean = false;
}

@Component({
  selector: 'app-providerlist',
  templateUrl: './providerlist.component.html',
  styleUrls: ['./providerlist.component.scss']
})
export class ProviderlistComponent {
  pageSize: number = 50;
  page: number = 1;
  filterTerm!: string;
  dataSource: ProviderList[] = [];
  Active: boolean = true;
  Suspended: boolean = false;
  Trial: boolean = false;
  Paid: boolean = false;
  ActiveStatus: string = '';
  TrailStatus: string = '';
  providersDataSource: ProviderList[] = [];
  filterOptions: FilterOprions = new FilterOprions()



  constructor(private adminservice: AdminService)
  {
  }

  ngOnInit(): void {
    this.getProviderList();
  }

  getProviderList() {
    this.adminservice.GetProviderList().subscribe(resp => {
      if (resp.IsSuccess) {
        this.providersDataSource = resp.ListResult;
        this.dataSource = resp.ListResult;
        this.filterChange('ActiveStatus', 'Active')
      } else
        this.providersDataSource = [];
    });
  }


  filterChange(eventType, event) {
    if (eventType == 'ActiveStatus') {
      if (event == 'Active' && this.Active) {
        this.Suspended = false;
        this.ActiveStatus = 'Active';
      } else if (event == 'Suspended' && this.Suspended) {
        this.Active = false;
        this.ActiveStatus = 'Suspended'
      } else {
        this.ActiveStatus = '';
      }
    } else {
      if (event == 'Trial' && this.Trial) {
        this.Paid = false;
        this.TrailStatus = 'Trial';
      }
      else if (event == 'Paid' && this.Paid) {
        this.Trial = false;
        this.TrailStatus = 'Paid'
      } else {
        this.TrailStatus = '';
      }
    }
    if (this.ActiveStatus != '' || this.TrailStatus != '') {
      if (this.ActiveStatus != '' && this.TrailStatus == '') {
        this.providersDataSource = this.dataSource.filter(x => x.ActiveStatus.toLocaleLowerCase() == this.ActiveStatus.toLocaleLowerCase());
      } else if (this.TrailStatus != '' && this.ActiveStatus == '') {
        this.providersDataSource = this.dataSource.filter(x => x.Trial.toLocaleLowerCase() == this.TrailStatus.toLocaleLowerCase());
      } else {
        this.providersDataSource = this.dataSource.filter(x => x.ActiveStatus.toLocaleLowerCase() == this.ActiveStatus.toLocaleLowerCase() && x.Trial.toLocaleLowerCase() == this.TrailStatus.toLocaleLowerCase());
      }
    }
    else {
      this.getProviderList();
    }
  }

  ForceProviderLogin(){

  }
}


