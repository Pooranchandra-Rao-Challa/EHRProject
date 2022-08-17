import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, ValidatorFn, FormControl } from '@angular/forms';

@Directive({
  selector: '[npiValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useClass: npiValidatorDirective,
      multi: true
    }
  ]
})
export class npiValidatorDirective implements Validator {

  validator: ValidatorFn;
  constructor() {
    this.validator = this.npiValidator();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

  npiValidator(): ValidatorFn {
    return (control: FormControl) => {
      if (control.value != null && control.value !== '') {
        //NPI numbers consist of 9 numeric digits followed by one numeric check digit, for a total of 10 numeric digits.
        let npi = control.value;
        let npiDigitArray = npi.split("").reverse()
                    .map((stringDigit: string) => { return Number(stringDigit) });
        let firstdigit = npiDigitArray[0];
        //The NPI numbers check digit is calculated using the ISO standard Luhn Formula algorithm for Modulus 10 "double-add-double".
        //event digist logic.
        let evenDigistArr = npiDigitArray
          .filter((a: number, i:number) => i % 2 == 1)
          .map((evenDigit: number) => {
            // doubling the number and adding into single digit if more than 10.
            let doubleNumber = 2 * Number(evenDigit);
            if (doubleNumber > 0) {
              let sum = 0;
              (doubleNumber + "").split("").map(val => { return Number(val) }).forEach(v => {
                sum += v;
              })
              return sum;
            } else return doubleNumber;
          })
        let resultsum = 0;

        //excluding first digit, odd digit logic is merged with even digit logic array
        npiDigitArray
          .filter((a: number, i: number) => i % 2 == 0 && i != 0)
          .concat(evenDigistArr)
          .forEach((v: number) => { resultsum += v })

        //NPI numbers are compatible with ISO identification card standards for a card issuer identifier
        //when using the 80840 prefix.
        // appending 24 for 80840 default appender to NPI number
        resultsum += 24;

        //The following NPI validation example will show you step by step how to apply ISO standard
        //Luhn algorithm for NPI number validation:
        let checkval = (resultsum + "").split("").reverse().map((v) => { return Number(v) })[0]
        if (checkval != 0) checkval = 10 - checkval
        if (firstdigit == checkval) return null;
        else return {
          npiValidator: { valid: false }
        };

      } else { return null }
    };
  }

}
