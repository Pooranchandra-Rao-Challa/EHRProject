import { AuthenticationService } from 'src/app/_services/authentication.service';
import { WeeklyUpdated } from './../../_models/_admin/weeklyupdated';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AdminViewModal } from 'src/app/_models';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-section-new',
  templateUrl: './section-new.component.html',
  styleUrls: ['./section-new.component.scss']
})
export class SectionNewComponent implements OnInit {
  menuName: any;
  displayHeading: string = ''
  SectionNew: any;
  WeeklyUpdate:any=[];
  viewModel: AdminViewModal;
  body:any;
  heading:any;
  successMsg:string;

  constructor(private router: Router, private route: ActivatedRoute,private authService:AuthenticationService,private adminservice: AdminService) {
    this.WeeklyUpdate = {} as WeeklyUpdated;
  }

  ngOnInit(): void {
    this.getComponentName();
    this.successMsg='';
    //this.getEditData();
  }

  getComponentName() {
    this.route.queryParams.subscribe((params) => {
      if (params.name != null) {
        if (params.edit == 'EditSection') {
          this.displayHeading = 'Edit Section';
          this.getEditData()
        }
        else { this.displayHeading = 'Add new Section'}
        this.menuName = params.name;
      }
    });
  }

  getEditData(){
    debugger;
     this.WeeklyUpdate = this.authService.viewModelAdmin;
     this.body= this.WeeklyUpdate.body;
     this.heading= this.WeeklyUpdate.header;
     console.log(this.WeeklyUpdate);
  }

  updateWeeklyRecord()
  {
    this.adminservice.AddUpdateWeeklyUpdated(this.WeeklyUpdate).subscribe(resp => {
      if (resp.IsSuccess) {
        this.WeeklyUpdate = resp.ListResult;
        if(resp.EndUserMessage='Weekly update successfully'){
          this.successMsg = 'update';
        }
        else{
          this.successMsg = 'created';
        }
        this.BackWeeklyUpdate('Weekly Update','admin/weeklyupdates');
      }
  });
 }

  BackWeeklyUpdate(name, url,msg?:string) {
    this.router.navigate(
      [url],
      { queryParams: { name: name,msg:this.successMsg} }
    );
  }


}




