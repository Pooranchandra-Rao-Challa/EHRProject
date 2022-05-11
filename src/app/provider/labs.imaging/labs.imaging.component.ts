import { AuthenticationService } from './../../_services/authentication.service';
import { User } from './../../_models/user';
import { LabsImagingService } from './../../_services/labsimaging.service';
import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-labs.imaging',
  templateUrl: './labs.imaging.component.html',
  styleUrls: ['./labs.imaging.component.scss']
})
export class LabsImagingComponent implements OnInit {

  labImagingColumn: string[] = ['Order', 'Test', 'Type', 'Patient', 'Provider','Status', 'LabImagingStatus','Created'];
  labImagingDataSource:any=[];
  user:User;
  constructor(private labimage:LabsImagingService,private authService:AuthenticationService) {
    this.user = authService.userValue;
    console.log(this.user);
  }

  ngOnInit(): void {
    this.GetLabDetails();
  }

  GetLabDetails()
  {
   var reqparam = {
     "clinic_Id": this.user.CurrentLocation
   }
   console.log(reqparam);
    debugger;
    this.labimage.LabsDetails(reqparam).subscribe(resp => {
     if (resp.IsSuccess) {
       this.labImagingDataSource = resp.ListResult;
     }
   });
  }

  GetImagingDetails()
  {
    var reqparam = {
      "clinic_Id": this.user.CurrentLocation
    }
     debugger;
     this.labimage.ImageDetails(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.labImagingDataSource = resp.ListResult;
      }
    });
  }
}
