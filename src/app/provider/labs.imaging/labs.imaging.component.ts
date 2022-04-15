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
  labImagingDataSource:any
  constructor(private labimage:LabsImagingService) { }

  ngOnInit(): void {
    this.GetLabDetails();
  }

  GetLabDetails()
  {
   var reqparam = {
     "clinic_Id": "5b686dd7c832dd0c444f288a"
   }
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
      "clinic_Id": "5b686dd7c832dd0c444f288a"
    }
     debugger;
     this.labimage.ImageDetails(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.labImagingDataSource = resp.ListResult;
      }
    });
  }
}
