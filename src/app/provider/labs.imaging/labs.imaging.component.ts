import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-labs.imaging',
  templateUrl: './labs.imaging.component.html',
  styleUrls: ['./labs.imaging.component.scss']
})
export class LabsImagingComponent implements OnInit {

  labImagingColumn: string[] = ['Order', 'Test', 'Type', 'Patient', 'Provider','Status', 'LabImagingStatus','Created'];
  labImagingTableList:any;
  labImagingDataSource:any 

  constructor() { }


  ngOnInit(): void {
    this.getLabList();
  }
  
  getLabList()
  {   
    this.labImagingDataSource=
      [
      { Order: 'Title 1', Test: 'Test', Type: 'Type1',Patient:'Patient',Provider:'Provider1',Status:'Status1',LabImagingStatus:'LabImagingStatus1',Created:'Created1' },
      { Order: 'Title 2', Test: 'Test2', Type: 'Type2',Patient:'Patient',Provider:'Provider2',Status:'Status2',LabImagingStatus:'LabImagingStatus2',Created:'Created2' }
      ]
  }
  
  getLabNullList()
  {
    this.labImagingDataSource= 0;
  }

  getImagingList(){   
    this.labImagingDataSource=
      [
        { Order: '1', Test: 'TestImg', Type: 'Type1',Patient:'Patient',Provider:'Provider1',Status:'Status1',LabImagingStatus:'LabImagingStatus1',Created:'Created1' },     
        { Order: '2', Test: 'TestImg2', Type: 'Type2',Patient:'Patient',Provider:'Provider2',Status:'Status2',LabImagingStatus:'LabImagingStatus2',Created:'Created2' }
      ]

   }

}
