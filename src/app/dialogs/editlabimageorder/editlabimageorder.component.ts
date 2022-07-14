import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-editlabimageorder',
  templateUrl: './editlabimageorder.component.html',
  styleUrls: ['./editlabimageorder.component.scss']
})
export class EditlabimageorderComponent implements OnInit {
  editorderlab: FormGroup;
  labingimagingattchements: FormGroup;
 
  
  constructor(private ref: EHROverlayRef, private fb: FormBuilder) { }

  ngOnInit(): void {
  this.pageloadevent();
  }
  cancel() {
    this.ref.close(null);
  }
  


pageloadevent() {
  this.labingimagingattchements = this.fb.group({
    testorder: this.fb.array([]),
  
  })
}
get testorder() {
  return this.labingimagingattchements.get('testorder') as FormArray
}
testorders() {
  this.testorder.push(
    this.newtestorder());
}
newtestorder() {

  return this.fb.group({
    code: "",
    test: "",
    result:"",
    	units:"",
      flag:"",
      range:"",
      delete:""

  })
}
removetestorder(i: number) {
  this.testorder.removeAt(i);
}




}
