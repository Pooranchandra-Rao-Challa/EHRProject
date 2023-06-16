import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[minvalue][formControlName],[minvalue][formControl],[minvalue][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinValueDirective, multi: true}]
})
export class MinValueDirective implements Validator {
  @Input()
  minvalue: number;

  validate(c: FormControl): {[key: string]: any} {
      let v = c.value;
      return ( v < this.minvalue)? {"minvalue": true} : null;
  }
}


@Directive({
  selector: '[maxvalue][formControlName],[maxvalue][formControl],[maxvalue][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: MaxValueDirective, multi: true}]
})
export class MaxValueDirective implements Validator {
  @Input()
  maxvalue: number;

  validate(c: FormControl): {[key: string]: any} {
      let v = c.value;
      return ( v > this.maxvalue)? {"maxvalue": true} : null;
  }
}
