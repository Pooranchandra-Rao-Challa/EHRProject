import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
var $
@Component({
  selector: 'app-weekly-updated',
  templateUrl: './weekly-updated.component.html',
  styleUrls: ['./weekly-updated.component.scss']
})
export class WeeklyUpdatedComponent implements OnInit {

  WeeklyUpdateList:any;

  public data: any = [
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

  public selectedValue: any='Marcela Arizmendi';
  public searchValue: any;
  public filteredList: any = [];


 constructor() { }

  ngOnInit(): void {
    this.filteredList = this.data;
    this.GetWeeklyUpdate();

  }
  GetWeeklyUpdate(){
    this.WeeklyUpdateList=[
      { Sequence:'2', Body:'<table class="table ctable"> <tbody> <tr> <td> <h4>Returning Patients:</h4> <small>(from last week)</small></td> <td style=" vertical-align: top; padding: 0; "><span style="fon',
      Header:'Your Weekly Snapshot', SlideType:'Count', LogoType:'1.0', Status:'Activate', NewsText:'', TagLine:'healthcare made easy',},
      { Sequence:'3', Body:'<h3 class="MsoNoSpacing"><span style="font-size:11pt"><span style="font-family:Calibri,sans-serif"><b><span style="font-size:12.0pt">&nbsp;Fully Integrated and certified electronic prescribing</span><',
      Header:'Introduces Rcopia and iPrescribe!', SlideType:'Info', LogoType:'1.0', Status:'Deactivate', NewsText:'Now live!', TagLine:'healthcare made easy',},
      { Sequence:'4', Body:'<h3 class="MsoNoSpacing"><span style="font-size:11pt"><span style="font-family:Calibri,sans-serif"><b><span style="font-size:12.0pt">Smart Scheduling System</span></b></span></span></h3> <ul> <li',
      Header:'Coming soon... to a practice near You!', SlideType:'Info', LogoType:'1.0', Status:'Activate', NewsText:'Major Update!', TagLine:'healthcare made easy',},
      { Sequence:'5', Body:'<table class="table ctable"> <tbody> <tr> <td> <h4>Returning Patients:</h4> <small>(from last week)</small></td> <td style=" vertical-align: top; padding: 0; "><span style="fon',
      Header:'Coming soon... to a practice near You!', SlideType:'Info', LogoType:'1.0', Status:'Deactivate', NewsText:'Major Update!', TagLine:'healthcare made easy',},
      { Sequence:'6', Body:'<table class="table ctable"> <tbody> <tr> <td> <h4>Returning Patients:</h4> <small>(from last week)</small></td> <td style=" vertical-align: top; padding: 0; "><span style="fon',
      Header:'Tell us how we are doing!', SlideType:'Info', LogoType:'1.0', Status:'Activate', NewsText:'', TagLine:'healthcare made easy',},

    ]
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
}
