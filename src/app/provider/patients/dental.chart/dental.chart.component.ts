import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dentalchart',
  templateUrl: './dental.chart.component.html',
  styleUrls: ['./dental.chart.component.scss']
})
export class DentalChartComponent implements OnInit {

  AdultPrem:boolean=true;
  ChilPrim:boolean=false;
  constructor() { }

  ngOnInit( ): void {
  }

  AdultPerm()
  {
    this.AdultPrem=true;
    this.ChilPrim=false;
  }

  ChildPrim(){
   this.AdultPrem=false;
   this.ChilPrim=true;
  }

}
