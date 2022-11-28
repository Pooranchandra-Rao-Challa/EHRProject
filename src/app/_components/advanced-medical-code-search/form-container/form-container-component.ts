import { FormFieldValue } from './../field-control/field-control-component';
import { Component, OnInit,Input,Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MedicalCode } from '../../../_models/codes';

@Component({
  selector: 'medical-code-container',
  templateUrl: 'form-container-component.html',
  styleUrls: ['form-container-component.scss'],
})
export class FormContainerComponent implements OnInit {
  formControl = new FormControl(
    {
       //value: { CodeSystem: '', SearchTerm: '' },
       disabled: false
    },
    AdvancedSearchValidetor
  );

  @Input()
  codeSystems: string[] = [];

  @Input()
  PlaceHolderText: string = "Start to type..."

  @Input()
  MinTermLength:number = 3

  @Input()
  showSelectedValue: boolean = true;

  @Input()
  Value: FormFieldValue
  // _fvalue: FormFieldValue
  // @Input()
  // set Value(fvalue: FormFieldValue) {
  //   this._fvalue = fvalue;
  // }
  // get Value() {
  //   return this._fvalue;
  // }

  // @Output() ValueChange = new EventEmitter<FormFieldValue>();

  @Output() optionChanged: EventEmitter<MedicalCode> =new EventEmitter<MedicalCode>();

  constructor() {
    if(this.codeSystems != null && this.codeSystems.length > 0)
    this.formControl.setValue({ CodeSystem: this.codeSystems[0], SearchTerm: '' })
  }

  ngOnInit(): void {}

  optionValueChanged(data: MedicalCode){
     this.optionChanged.emit(data);
  }
}


function AdvancedSearchValidetor(control: FormControl) {
  return control.value.CodeSystem !== null && control.value.SearchTerm !== ''
    ? null
    : {
        validateSearch: {
          valid: true,
        },
      };
}
