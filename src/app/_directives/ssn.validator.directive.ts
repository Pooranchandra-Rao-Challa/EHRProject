import { Directive, Renderer2 } from '@angular/core';
import { Validator, NG_VALIDATORS, ValidatorFn, FormControl } from '@angular/forms';

@Directive({
  selector: '[ssnValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useClass: ssnValidatorDirective,
      multi: true
    }
  ]
})
export class ssnValidatorDirective implements Validator {

  validator: ValidatorFn;
  constructor(private renderer:Renderer2) {
    this.validator = this.ssnValidator();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

  ssnValidator(): ValidatorFn {
    return (control: FormControl) => {
      let start = this.renderer.selectRootElement('#ssn').selectionStart;
      let end = this.renderer.selectRootElement('#ssn').selectionEnd;
      let pattern = /^(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/;
      let val = control.value.replace(pattern, '');

      control.setValue(val,{emitEvent: false})
      this.renderer.selectRootElement('#ssn').setSelectionRange(start,end);


      if (control.value != null && control.value !== '') {
        if(pattern.test(control.value)) return null;
        else return {
          ssnValidator: { valid: false }
        };

      } else { return null }
    };
  }

}
