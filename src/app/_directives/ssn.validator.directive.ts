import { Directive } from '@angular/core';
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
  constructor() {
    this.validator = this.ssnValidator();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

  ssnValidator(): ValidatorFn {
    return (control: FormControl) => {
      if (control.value != null && control.value !== '') {
        let pattern = /^(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/;
        if(pattern.test(control.value)) return null;
        else return {
          npiValidator: { valid: false }
        };

      } else { return null }
    };
  }

}
