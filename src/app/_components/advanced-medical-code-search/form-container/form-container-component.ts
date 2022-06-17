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
    { value: { scope: '', query: '' }, disabled: false },
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

  @Output() optionChanged: EventEmitter<MedicalCode> =new EventEmitter<MedicalCode>();

  constructor() {}

  ngOnInit(): void {}

  optionValueChanged(data: MedicalCode){
    //console.log(this.showSelectedValue);

    this.optionChanged.emit(data);
  }
}


function AdvancedSearchValidetor(control: FormControl) {
  return control.value.scope !== null && control.value.query !== ''
    ? null
    : {
        validateSearch: {
          valid: true,
        },
      };
}
