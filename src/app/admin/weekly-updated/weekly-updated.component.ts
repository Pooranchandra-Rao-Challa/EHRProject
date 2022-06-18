import { WeeklyUpdated } from './../../_models/_admin/weeklyupdated';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { AdminViewModal } from 'src/app/_models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-weekly-updated',
  templateUrl: './weekly-updated.component.html',
  styleUrls: ['./weekly-updated.component.scss']
})
export class WeeklyUpdatedComponent implements OnInit {

  WeeklyUpdatedList: any = [];
  selectedValue: any;
  searchValue: any;
  filteredList: any = [];
  DisplayTdBody: any;
  RowIndex: any;
  ProviderList: any = [];
  ProviderName: any = [];
  FistProviderName: any;
  viewModel: AdminViewModal;
  WeeklyUpdated:any;
  displayHeading:any;
  weeklyUpdate:WeeklyUpdated
  constructor(private router: Router, private adminservice: AdminService,private authService:AuthenticationService) {
    this.weeklyUpdate = {} as WeeklyUpdated;
  }

  ngOnInit(): void {
    this.GetWeeklyUpdate();
    this.GetProviderNameList();
  }

  GetWeeklyUpdate() {
    this.adminservice.WeeklyUpdateList().subscribe(resp => {
      if (resp.IsSuccess) {
        this.WeeklyUpdatedList = resp.ListResult;
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
  }

  filterDropdown(e) {
    window.scrollTo(window.scrollX, window.scrollY + 1);
    let searchString = e.toLowerCase();
    if (!searchString) {
      this.filteredList = this.ProviderList.slice();
      return;
    }
    else {
      this.filteredList = this.ProviderList.filter(
        user => user.ProviderName.toLowerCase().indexOf(searchString) > -1
      );}
    window.scrollTo(window.scrollX, window.scrollY - 1);
  }

  selectValue(name) {
    this.selectedValue = name;
  }

  AddSectionNew(name, url) {
    this.router.navigate(
      [url],
      { queryParams: { name: name } }
    );
    this.UpdateWeeklyUpdatedView(null);
  }

  EditSectionNew(name, url,item) {
    this.router.navigate(
      [url],
      { queryParams: { name: name, edit: 'EditSection' } }
    );
    this.UpdateWeeklyUpdatedView(item);
  }

  UpdateWeeklyUpdatedView(item) {
    this.authService.SetViewParamAdmin(item);
    this.viewModel = this.authService.viewModelAdmin;
    console.log(this.viewModel);

  }

  // drodpown provider list
  GetProviderNameList() {
    this.adminservice.GetProviderList().subscribe(resp => {
      if (resp.IsSuccess) {
        this.ProviderList = resp.ListResult;
        this.filteredList = this.ProviderList;
        this.FistProviderName = this.filteredList[0].ProviderName
        this.selectedValue = this.FistProviderName;
      }
    });
  }

  // update status as active/deactive
  updateStatus(item){
    let Stauts;
    if(item.Status == 'DeActivate'){Stauts = 0;}
    else{Stauts = 1;}

    let reqparams={
      'Id':item.Id,
      'Status':Stauts}

    this.adminservice.UpdateWeeklyStaus(reqparams).subscribe( resp =>{
      if (resp.IsSuccess) {this.GetWeeklyUpdate();}
    })
  }

  // delete weeklyupdated records.
  deleteWeeklyUpdated(id){
    let reqparam={
      'Id':id
    }
    this.adminservice.DeleteWeeklyStatus(reqparam).subscribe( resp =>{
      if (resp.IsSuccess) {
        this.GetWeeklyUpdate();
      }
    })
  }

  // confirm for the status
  confirmStatus(item) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-warning'
      },
      buttonsStyling: true,
    });
    swalWithBootstrapButtons.fire(
    {
      title: 'Are you sure you want to change the status',
      showCancelButton: true,
      confirmButtonText: 'Yes',
     // cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.updateStatus(item);
      }
      this.GetWeeklyUpdate();
    });
  }

  // confirmation for delete
  confirmdelete(id) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-warning'
      },
      buttonsStyling: true,
    });
    swalWithBootstrapButtons.fire(
    {
      title: 'Are you sure you want to delete the record',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.deleteWeeklyUpdated(id);
      }
      this.GetWeeklyUpdate();
    });
  }


}

