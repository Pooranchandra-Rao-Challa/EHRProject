import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';

import {
  NG_VALUE_ACCESSOR, ControlValueAccessor
} from '@angular/forms';

@Directive({
  selector: '[numberMask]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: NunberMaskDirective,
    multi: true
  }]
})
export class NunberMaskDirective implements ControlValueAccessor {

  onTouched: any;
  onChange: any;

  @Input() numberMask: string;
  @Output() retorNoNumberMask = new EventEmitter();

  constructor() { }

  writeValue(value: any): void {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('keyup', ['$event'])
  onKeyup($event: any) {
    // codigo
    var valor = $event.target.value.replace(/\D/g, '');
    var pad = this.numberMask.replace(/\D/g, '').replace(/9/g, '_');
    var valorMask = valor + pad.substring(0, pad.length - valor.length);

    // retorna caso pressionado backspace
    if ($event.keyCode === 8) {
      this.onChange(valor);
      return;
    }

    if (valor.length <= pad.length) {
      this.onChange(valor);
    }

    var valorMaskPos = 0;
    valor = '';
    for (var i = 0; i < this.numberMask.length; i++) {
      if (isNaN(parseInt(this.numberMask.charAt(i)))) {
        valor += this.numberMask.charAt(i);
      } else {
        valor += valorMask[valorMaskPos++];
      }
    }

    if (valor.indexOf('_') > -1) {
      valor = valor.substr(0, valor.indexOf('_'));
    }

    $event.target.value = valor;
    this.retorNoNumberMask.emit($event.target.value);
  }

  @HostListener('blur', ['$event'])
  onBlur($event: any) {
    // codigo
    if ($event.target.value.length === this.numberMask.length) {
      return;
    }
    this.onChange('');
    $event.target.value = '';
    this.retorNoNumberMask.emit($event.target.value);
  }
}



























// import { Directive, ElementRef, Input, OnInit, OnDestroy,Renderer2 } from '@angular/core';
// import { FormGroup,FormBuilder,AbstractControl,Validators } from '@angular/forms';
// import { ISubscription } from 'rxjs/Subscription';





// @Directive({
//   selector: '[ssnMask]'
// })
// export class SSNMaskDirective implements OnInit, OnDestroy{

//   private _ssnControl:AbstractControl;
//   private _preValue:string;

//   @Input()
//   set ssnControl(control:AbstractControl){
//     this._ssnControl = control;
//   }
//   @Input()
//   set preValue(value:string){
//     this._preValue = value;
//   }

//   private sub:ISubscription;

//   constructor(private el: ElementRef,private renderer:Renderer2) {}

//   ngOnInit(){
//      this.phoneValidate();
//   }

//   ngOnDestroy() {
//     this.sub.unsubscribe();
//   }

//   phoneValidate(){

//     this.sub = this._ssnControl.valueChanges.subscribe(data => {

//       /**the most of code from @Günter Zöchbauer's answer.*/

//       /**we remove from input but:
//          @preInputValue still keep the previous value because of not setting.
//       */
//       let preInputValue:string = this._preValue;
//       var lastChar:string = preInputValue.substring(preInputValue.length - 1);
//       // remove all mask characters (keep only numeric)
//       var newVal = data.replace(/\D/g, '');

//       let start = this.renderer.selectRootElement('#ssn').selectionStart;
//       let end = this.renderer.selectRootElement('#ssn').selectionEnd;

//       //let start=this.phoneRef.nativeElement.selectionStart;
//       //let end = this.phoneRef.nativeElement.selectionEnd;
//       //when removed value from input
//       if (data.length < preInputValue.length) {
//         // this.message = 'Removing...'; //Just console
//       /**while removing if we encounter ) character,
//         then remove the last digit too.*/
//       if(preInputValue.length < start){
//         if(lastChar == ')'){
//           newVal = newVal.substr(0,newVal.length-1);
//         }
//       }
//       //if no number then flush
//       if (newVal.length == 0) {
//         newVal = '';
//       }
//       else if (newVal.length <= 3) {
//         /**when removing, we change pattern match.
//         "otherwise deleting of non-numeric characters is not recognized"*/
//         newVal = newVal.replace(/^(\d{0,3})/, '$1-');
//       } else if (newVal.length <= 6) {
//         newVal = newVal.replace(/^(\d{0,3})(\d{0,2})/, '$1-$2');
//       } else {
//         newVal = newVal.replace(/^(\d{0,3})(\d{0,2})(\d{0,4})/, '$1-$2-$3');
//       }

//       this._ssnControl.setValue(newVal,{emitEvent: false});
//        //keep cursor the normal position after setting the input above.
//       this.renderer.selectRootElement('#ssn').setSelectionRange(start,end);
//     //when typed value in input
//     } else{
//       // this.message = 'Typing...'; //Just console
//       var removedD = data.charAt(start);
//     // don't show braces for empty value
//     if (newVal.length == 0) {
//       newVal = '';
//     }
//     // don't show braces for empty groups at the end
//     else if (newVal.length <= 3) {
//       newVal = newVal.replace(/^(\d{0,3})/, '$1-');
//     } else if (newVal.length <= 6) {
//       newVal = newVal.replace(/^(\d{0,3})(\d{0,2})/, '$1-$2');
//     } else {
//       newVal = newVal.replace(/^(\d{0,3})(\d{0,2})(\d{0,4})/, '$1-$2-$3');
//     }
//     //check typing whether in middle or not
//     //in the following case, you are typing in the middle
//     if(preInputValue.length >= start){
//       //change cursor according to special chars.
//       if(removedD == '('){
//         start = start +1;
//         end = end +1;
//       }
//       if(removedD == ')'){
//         start = start +2; // +2 so there is also space char after ')'.
//         end = end +2;
//       }
//       if(removedD == '-'){
//         start = start +1;
//         end = end +1;
//       }
//       if(removedD == " "){
//           start = start +1;
//           end = end +1;
//         }
//       this._ssnControl.setValue(newVal,{emitEvent: false});
//       this.renderer.selectRootElement('#ssn').setSelectionRange(start,end);
//     } else{
//         this._ssnControl.setValue(newVal,{emitEvent: false});
//         this.renderer.selectRootElement('#ssn').setSelectionRange(start+2,end+2); // +2 because of wanting standard typing
//     }
//   }
//   });
//  }
// }
