import { dentalchartService } from '../../../_services/dentalchart.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../_services/authentication.service';

declare var $: any;
@Component({
  selector: 'app-dentalchart',
  templateUrl: './dental.chart.component.html',
  styleUrls: ['./dental.chart.component.scss']
})
export class DentalChartComponent implements OnInit {

  AdultPrem: boolean = true;
  ChilPrim: boolean = false;
  displayStyle = "none";
  DentalNumber: number;
  procedureCodeList: any = [];

  constructor(private dentalService: dentalchartService) { }

  ngOnInit(): void {
    this.getProcedureList();
  }

  getProcedureList() {
    this.dentalService.ProcedureCodes().subscribe(resp => {
      if (resp.IsSuccess) {
        this.procedureCodeList = resp.ListResult;
        this.procedureCodeList.map((e) => {
          if (e.Category != '') {
            e.isClosed = true;
          }
        });
      }
    });
  }

  expandCollapse(obj) {
    //debugger
    obj.isClosed = !obj.isClosed;
    // let procedureList:any = [];
    // procedureList = obj.value;
    for (let index = 0; index < obj.value.length; obj++) {
      this.procedureCodeList[index].isClosed = !obj.isClosed;
    }
  }

  AdultPerm() {
    this.AdultPrem = true;
    this.ChilPrim = false;
  }

  ChildPrim() {
    this.AdultPrem = false;
    this.ChilPrim = true;
  }

  OpenDentalModal(number) {
    this.DentalNumber = number;
    this.displayStyle = "block";
  }

  CloseDentalModal() {
    this.displayStyle = "none";
  }
}
