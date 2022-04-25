import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-adduser.dailouge',
  templateUrl: './adduser.dailouge.component.html',
  styleUrls: ['./adduser.dailouge.component.scss']
})
export class AddUserDailougeComponent implements OnInit {

  myControl = new FormControl();
  filteredOptions:any;
  codeList :string[]  = ['501', '502', '401','402','601','603'];
  DisplayPwdInput:boolean=true;
  constructor() { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''),map(value => this.Filter(value)),);
    console.log("Data",JSON.stringify(this.filteredOptions));
  }

  Filter(value: string): string[] {
    debugger;
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

}
