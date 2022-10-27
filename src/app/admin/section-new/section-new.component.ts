import { AuthenticationService } from 'src/app/_services/authentication.service';
import { WeeklyUpdated } from './../../_models/_admin/weeklyupdated';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AdminViewModal } from 'src/app/_models';
import { AdminService } from 'src/app/_services/admin.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-section-new',
  templateUrl: './section-new.component.html',
  styleUrls: ['./section-new.component.scss']
})
export class SectionNewComponent implements OnInit {
  SectionView: string;
  WeeklyUpdate: WeeklyUpdated;
  viewModel: AdminViewModal;
  body: string;
  successMsg: string;
  SequenceNumber: number;
  WeeklyUpdatedList: any = [];

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthenticationService,
    private adminservice: AdminService) {
    this.WeeklyUpdate = this.authService.viewModel.WeeklyUpdate == null ? new WeeklyUpdated() : this.authService.viewModel.WeeklyUpdate;
    this.SectionView = this.authService.viewModel.AdminViewName;
  }

  ngOnInit(): void {
    this.body = this.WeeklyUpdate.Body;
    this.getSequenceNo();
  }

  getSequenceNo(){
    this.adminservice.WeeklyUpdateList().subscribe(resp => {
      if (resp.IsSuccess) {
        this.WeeklyUpdatedList = resp.ListResult;
        this.SequenceNumber = this.WeeklyUpdatedList.length - 1;
        if(this.WeeklyUpdate.WeeklyUpdateId == null && this.WeeklyUpdatedList.length > 0){
          this.WeeklyUpdate.Sequence = this.WeeklyUpdatedList[this.SequenceNumber].Sequence + 1;
        }
        else if(this.WeeklyUpdate.WeeklyUpdateId == null && this.WeeklyUpdatedList.length == 0){
          this.WeeklyUpdate.Sequence = 1;
        }
      }
  });
 }

  updateWeeklyRecord() {
    this.adminservice.AddUpdateWeeklyUpdated(this.WeeklyUpdate).subscribe(resp => {
      if (resp.IsSuccess) {
        this.WeeklyUpdate = resp.ListResult;
        if (resp.EndUserMessage =='WeeklyUpdated created successfully') {
          this.show('Admin/Section created successfully');
        }
        else {
          this.show('Admin/Section Updated successfully');
        }
        this.BackWeeklyUpdate('Weekly Update', 'admin/weeklyupdates');
      }
    });
  }

  show(msg) {
    Swal.fire({
      // position: 'center',
      text: msg,
      confirmButtonText: 'close',
      confirmButtonColor:'#337ab7',
      // confirmButtonAriaLabel:'false',
      customClass: {
        container: 'swal2-container-high',
        confirmButton: 'swal-messaage'
      }


    });
  }

  BackWeeklyUpdate(name, url) {
    this.router.navigate(
      [url],
      { queryParams: { name: name } }
    );
  }

}




