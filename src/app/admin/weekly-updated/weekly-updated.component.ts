import { Route, ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
var $
@Component({
  selector: 'app-weekly-updated',
  templateUrl: './weekly-updated.component.html',
  styleUrls: ['./weekly-updated.component.scss']
})
export class WeeklyUpdatedComponent implements OnInit {

  WeeklyUpdatedList: any = [];

  data: any = [
    { name: "Marcela Arizmendi" },
    { name: "Muon Vy" },
    { name: "Usability Test Doctor" },
    { name: "Karina Giron" },
    { name: "Marcela Arizmendi" },
    { name: "Muon Vy" },
    { name: "Usability Test Doctor" },
    { name: "Karina Giron" },
    { name: "Marcela Arizmendi" },
    { name: "Muon Vy" },
    { name: "Usability Test Doctor" },
    { name: "Karina Giron" },

  ];

  selectedValue: any;
  searchValue: any;
  filteredList: any = [];
  DisplayTdBody: any;
  RowIndex: any;
  ProviderList: any = [];
  ProviderName: any = [];
  FistProviderName: any;


  constructor(private router: Router, private adminservice: AdminService) { }

  ngOnInit(): void {
    this.GetWeeklyUpdate();
    this.GetProviderNameList();

  }

  GetWeeklyUpdate() {
    this.adminservice.WeeklyUpdateList().subscribe(resp => {
      if (resp.IsSuccess) {
        this.WeeklyUpdatedList = resp.ListResult;
        // console.log(this.WeeklyUpdatedList);
      }
      else {
        this.WeeklyUpdatedList = [];
      }
    });

  }

  GetBodyData(row) {
    this.RowIndex = row;
    let bodydata = this.WeeklyUpdatedList[row];
    this.DisplayTdBody = bodydata.body;
    //  console.log(this.DisplayTdBody);

  }

  filterDropdown(e) {
    // console.log("e in filterDropdown -------> ", e);
    window.scrollTo(window.scrollX, window.scrollY + 1);
    let searchString = e.toLowerCase();
    if (!searchString) {
      this.filteredList = this.ProviderList.slice();
      // console.log(this.filteredList)
      return;
    } else {
      this.filteredList = this.ProviderList.filter(
        user => user.ProviderName.toLowerCase().indexOf(searchString) > -1
      );
      // console.log(this.filteredList)
    }
    window.scrollTo(window.scrollX, window.scrollY - 1);
    // console.log("this.filteredList indropdown -------> ", this.filteredList);
  }

  selectValue(name) {
    this.selectedValue = name;
  }

  AddSectionNew(name, url) {
    this.router.navigate(
      [url],
      { queryParams: { name: name } }
    );
  }

  EditSectionNew(name, url) {
    this.router.navigate(
      [url],
      { queryParams: { name: name, edit: 'EditSection' } }
    );
  }

  GetProviderNameList() {
    this.adminservice.GetProviderList().subscribe(resp => {
      if (resp.IsSuccess) {
        this.ProviderList = resp.ListResult;
        // this.ProviderName = this.ProviderList.map(t=>t.ProviderName);
        this.filteredList = this.ProviderList;
        this.FistProviderName = this.filteredList[0].ProviderName
        this.selectedValue = this.FistProviderName;
        // console.log(this.filteredList);
      }
    });
  }
}
