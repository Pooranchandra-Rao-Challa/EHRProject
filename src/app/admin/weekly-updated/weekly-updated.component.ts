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

  selectedValue: any = 'Marcela Arizmendi';
  searchValue: any;
  filteredList: any = [];
  DisplayTdBody: any;
  RowIndex: any;


  constructor(private router: Router, private adminservice: AdminService) { }

  ngOnInit(): void {
    this.filteredList = this.data;
    this.GetWeeklyUpdate();
  }

  GetWeeklyUpdate() {
    this.adminservice.WeeklyUpdateList().subscribe(resp => {
      if (resp.IsSuccess) {
        this.WeeklyUpdatedList = resp.ListResult;
        console.log(this.WeeklyUpdatedList);
      }
      else {
        this.WeeklyUpdatedList = [];
      }
    });

  }

  GetBodyData(row) {
   this.RowIndex = row;
   let bodydata =this.WeeklyUpdatedList[row];
   this.DisplayTdBody = bodydata.body;
   console.log(this.DisplayTdBody);

  }

  filterDropdown(e) {
    console.log("e in filterDropdown -------> ", e);
    window.scrollTo(window.scrollX, window.scrollY + 1);
    let searchString = e.toLowerCase();
    if (!searchString) {
      this.filteredList = this.data.slice();
      return;
    } else {
      this.filteredList = this.data.filter(
        user => user.name.toLowerCase().indexOf(searchString) > -1
      );
    }
    window.scrollTo(window.scrollX, window.scrollY - 1);
    console.log("this.filteredList indropdown -------> ", this.filteredList);
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
}
