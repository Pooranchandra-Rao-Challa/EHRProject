import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-adduser.dialog',
  templateUrl: './adduser.dialog.component.html',
  styleUrls: ['./adduser.dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {

  myControl = new FormControl();
  filteredOptions:any;
  codeList :string[]  = ['501', '502', '401','402','601','603'];
  DisplayPwdInput:boolean=true;
  constructor(private ref: EHROverlayRef,) { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''),map(value => this.Filter(value)),);
    console.log("Data",JSON.stringify(this.filteredOptions));
  }

  Filter(value: string): string[] {
    //debugger;
    if(value==""){
      return ['Please enter 1 or more characters']
    }
    const filterValue = value.toLowerCase();
    var searchData=this.codeList.filter(option => option.toLowerCase().includes(filterValue));
    if(searchData.length===0){
      return ['No Data Found']
    }
    return searchData;
  }
  GeneratePassword()
  {
    this.DisplayPwdInput=false;
  }
  close() {
    this.ref.close(null);
  }
}
