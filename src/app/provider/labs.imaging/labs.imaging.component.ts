import { Component, OnInit } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-labs.imaging',
  templateUrl: './labs.imaging.component.html',
  styleUrls: ['./labs.imaging.component.scss']
})
export class LabsImagingComponent implements OnInit {
 
  labImagingColumn: string[] = ['Order', 'Test', 'Type', 'Patient', 'Provider','Status', 'Lab/Imaging Status','Created'];
  labImagingTableList:any;
  labImagingDataSource:any
  constructor() { }

  ngOnInit(): void {
    this.labImagingDataSource=null;
  }
}
