import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";
import { EHROverlayRef } from "src/app/ehr-overlay-ref";
import { MedicalCode } from "src/app/_models/codes";
import { UtilityService } from "src/app/_services/utiltiy.service";


export class TestCode {
  Code?: string;
  Description?: string;
  Index?: number;
  Query?: string;
  Scope?: string;
}


@Component({
  selector: 'app-order-dialog',
  templateUrl: './test.code.component.html',
  styleUrls: ['./test.code.component.scss']
})
export class TestCodeComponent implements OnInit{
  filteredOptions: Observable<MedicalCode[]>;
  testCodeData: TestCode;
  selection: MedicalCode;
  dialogIsLoading: boolean = false;
  textCodeForm: FormGroup;
  useNewCode: boolean = false;
  constructor(private ref: EHROverlayRef,
    private utilityService: UtilityService,
    private fb: FormBuilder,) {
    this.dialogIsLoading = true;
    this.testCodeData = ref.RequestData as TestCode;
    this.loadTestCodes();
  }
  ngOnInit(): void {
    this.textCodeForm = this.fb.group({
      Code: ['', [Validators.required, Validators.pattern(/^[0-9_-\s]+$/)]],
      Test: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9*%#@&\(\)\[\]\/!~+=,\.;_-\s]+$/)]],
    })
  }
  get code(){
    return this.textCodeForm.get('Code');
  }
  get test(){
    return this.textCodeForm.get('Test');
  }
  cancel() {
    this.ref.close();
  }
  SelectTestCode() {
    if (this.selection != null) {
      this.testCodeData.Code = this.selection.Code;
      this.testCodeData.Description = this.selection.Description;
      this.ref.close({ 'TestCode': this.testCodeData })
    }

  }
  loadTestCodes() {
    this.utilityService.MedicalCodes(this.testCodeData.Query, this.testCodeData.Scope)
      .subscribe(resp => {
        this.dialogIsLoading = false;
        if (resp.IsSuccess) {
          let values = resp.ListResult as MedicalCode[];
          this.filteredOptions = of(values);
        } else this.filteredOptions = of([]);
      });
  }

  UseTheNewCode() {
    if(!this.useNewCode){
      let value = this.textCodeForm.getRawValue();
      if(value.Code != null
        && value.Code != ""
        && value.Test != null
        && value.Test != ""){
          this.useNewCode = true;
          this.selection = new MedicalCode();
          this.selection.Code = value.Code;
          this.selection.Description = value.Test;
        }
        else{
          this.code.markAsTouched();
          this.test.markAsTouched();
        }
    }else{
      this.useNewCode = false;
      this.selection = null;
    }
  }



}
