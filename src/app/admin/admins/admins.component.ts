import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  isAddAdmin: boolean = false;
  isSave: boolean = true;
  codeValue= new FormControl();
  myControl = new FormControl();
  filteredOptions:any;
  codeList :string[]  = ['501', '502', '401','402','601','603'];

  constructor() { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''),map(value => this._filter(value)),);
    console.log("Data",JSON.stringify(this.filteredOptions));
  }  
    
  private _filter(value: string): string[] {
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

 isView() {
  debugger;
    this.isSave = true;
    this.isAddAdmin = false;
    
  }
  onAddAdmin() {
    this.isAddAdmin = true;
    this.isSave = false;
  }
}
