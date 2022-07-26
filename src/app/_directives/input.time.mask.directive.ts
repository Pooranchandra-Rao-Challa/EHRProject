
import {
  BACKSPACE,
  DELETE,
  LEFT_ARROW,
  NINE,
  NUMPAD_NINE,
  NUMPAD_ZERO,
  RIGHT_ARROW,
  TAB,
  ZERO,
  A,
  P,

} from '@angular/cdk/keycodes';
import {
  Directive,
  ElementRef,
  forwardRef,
  Host,
  HostListener,
  OnInit,
  Renderer2,
  Self,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { isNumeric } from 'rxjs/util/isNumeric';
@Directive({
  selector: '[appTimeMask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeMaskDirective),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimeMaskDirective),
      multi: true,
    },
  ],
})
export class TimeMaskDirective implements OnInit, ControlValueAccessor, Validator {
  /** implements ControlValueAccessorInterface */
  _onChange: (_: string) => void;

  /** implements ControlValueAccessorInterface */
  _touched: () => void;

  private _dateValue: Date;

  /**
   * This variable indicates that the field (hours or minutes) should behave as
   * if it had just received the focus
   */
  private _fieldJustGotFocus = false;

  constructor(@Self() private _el: ElementRef, private _renderer: Renderer2) {}

  ngOnInit() {
    this._el.nativeElement.style.fontFamily = 'monospace';
    this._el.nativeElement.style.cursor = 'default';
  }

  /** treat the keyss */
  @HostListener('keydown', ['$event'])
  onKeyDown(evt: KeyboardEvent) {


    const keyCode = evt.keyCode;
    switch (keyCode) {
      case LEFT_ARROW:
      case RIGHT_ARROW:
      case TAB:
        this._decideWhetherToJumpAndSelect(keyCode, evt);
        break;

      case DELETE:
      case BACKSPACE:
        this._clearHoursOrMinutes();
        break;

      default:
        if ((keyCode >= ZERO && keyCode <= NINE) ||
          (keyCode >= NUMPAD_ZERO && keyCode <= NUMPAD_NINE)) {
          // treat numbers
          this._setInputText(evt.key);
        }
        else if(keyCode == A || keyCode == P){
          this._setInputText(evt.key);
        }
    }

    // prevents the component from trying to update itself:
    // 1 - When the user types a number it would cause the screen to flicker: once because we are
    //     changing the component value and once as the default response to the user typing
    // 2 - When the user types a key other than those dealt with above, it should be ignored.
    if (keyCode !== TAB) {
      evt.preventDefault();
    }
  }

  /**When the component receives a click, it is necessary to select hours or minutes */
  @HostListener('click', ['$event'])
  onClick(evt: MouseEvent) {
    this._fieldJustGotFocus = true;
    const caretPosition = this._doGetCaretPosition();
    if (caretPosition < 3) {
      this._el.nativeElement.setSelectionRange(0, 2);
    } else if (caretPosition >= 3 && caretPosition < 6) {
      this._el.nativeElement.setSelectionRange(3, 5);
    }else  {
      this._el.nativeElement.setSelectionRange(6, 7);
    }
  }

  /** When the component receives focus, you need to select hours or minutes */
  @HostListener('focus', ['$event'])
  onFocus(evt: any) {
    this._fieldJustGotFocus = true;
    const caretPosition = this._doGetCaretPosition();
    if (caretPosition < 3) {
      this._el.nativeElement.setSelectionRange(0, 2);
    } else if (caretPosition >= 3 && caretPosition < 6){
      this._el.nativeElement.setSelectionRange(3, 5);
    }else  {
      this._el.nativeElement.setSelectionRange(6, 7);
    }
  }

  /** When the component loses focus, it triggers the ControlValueAccessor touched */
  @HostListener('blur', ['$event'])
  onBlur(evt: any) {
    this._touched();
  }

  /**
   * Method called when user clicks right or left arrow
   * When the user navigates with the arrows, some actions need to be taken
   * to select the right field: hours or minutes
   */
  private _decideWhetherToJumpAndSelect(keyCode: number, evt?: KeyboardEvent) {

    const caretPosition = this._doGetCaretPosition();

    switch (keyCode) {
      case RIGHT_ARROW:
        if(caretPosition < 3)
          this._el.nativeElement.setSelectionRange(3, 5);
        else if (caretPosition > 2 && caretPosition < 6)
          this._el.nativeElement.setSelectionRange(6, 7);
        break;

      case LEFT_ARROW:
        if(caretPosition > 5){
          this._el.nativeElement.setSelectionRange(3, 5);
        }else if (caretPosition > 2 && caretPosition < 6)
          this._el.nativeElement.setSelectionRange(0, 2);
        break;

      case TAB:
        if (caretPosition < 3 && !evt.shiftKey) {
          this._el.nativeElement.setSelectionRange(3, 5);
          evt.preventDefault();
        } else if (caretPosition > 2 && caretPosition < 6 && !evt.shiftKey) {
          this._el.nativeElement.setSelectionRange(6, 7);
          evt.preventDefault();
        } else if(caretPosition > 5 && evt.shiftKey){
          this._el.nativeElement.setSelectionRange(3, 5);
        }else if (caretPosition > 3 && caretPosition < 6 && evt.shiftKey) {
          this._el.nativeElement.setSelectionRange(0, 2);
          evt.preventDefault();
        }
    }

    this._fieldJustGotFocus = true;
  }

  /**
   * Method called when user types a number key
   */
  private _setInputText(key: string) {
    const inputvalue = this._el.nativeElement.value;
    const meridian = inputvalue.split(' ')[1];
    const input: string[] = inputvalue.split(' ')[0].split(':');

    const hours: string = input[0];
    const minutes: string = input[1];

    const caretPosition = this._doGetCaretPosition();
    if(isNumeric(key)){
      if (caretPosition < 3) {
        this._setHours(hours, minutes, meridian ,key);
      } else{
        this._setMinutes(hours, minutes,meridian, key);
      }
    }
    else{
      this._setMeridianField(hours,minutes,key)
    }

    this._fieldJustGotFocus = false;
  }

  /** Adjust the time field */
  private _setHours(hours: string, minutes: string, meridian: string, key) {
    const hoursArray: string[] = hours.split('');
    const firstDigit: string = hoursArray[0];
    const secondDigit: string = hoursArray[1];

    let newHour = '';

    let completeTime = '';
    let sendCaretToMinutes = false;

    if (firstDigit === '-' || this._fieldJustGotFocus) {
      newHour = `0${key}`;
      sendCaretToMinutes = Number(key) > 2;
    } else {
      newHour = `${secondDigit}${key}`;
      if (Number(newHour) > 12) {
        newHour = '12';
      }
      sendCaretToMinutes = true;
    }

    completeTime = `${newHour}:${minutes} ${meridian}`;

    this._renderer.setProperty(this._el.nativeElement, 'value', completeTime);
    this._controlValueChanged();
    if (!sendCaretToMinutes) {
      this._el.nativeElement.setSelectionRange(0, 2);
    } else {
      this._el.nativeElement.setSelectionRange(3, 5);
      this._fieldJustGotFocus = true;
    }
  }

  /** Adjust the minutes field */
  private _setMinutes(hours: string, minutes: string, meridian: string,key) {
    const minutesArray: string[] = minutes.split('');
    const firstDigit: string = minutesArray[0];
    const secondDigit: string = minutesArray[1];

    let newMinutes = '';

    let completeTime = '';

    let sendCaretToMeridian = false;

    if (firstDigit === 'm' || this._fieldJustGotFocus) {
      newMinutes = `0${key}`;
    } else {
      if (Number(minutes) === 59) {
        newMinutes = `0${key}`;
      } else {
        newMinutes = `${secondDigit}${key}`;
        if (Number(newMinutes) > 59) {
          newMinutes = '59';
        }
      }
      sendCaretToMeridian =true;
    }

    completeTime = `${hours}:${newMinutes} ${meridian}`;

    this._renderer.setProperty(this._el.nativeElement, 'value', completeTime);
    this._controlValueChanged();
    if(!sendCaretToMeridian)
      this._el.nativeElement.setSelectionRange(3, 5);
    else{
      this._el.nativeElement.setSelectionRange(6, 7);
      this._fieldJustGotFocus = true;
    }

  }

  /** Set Meridian field */
  _setMeridianField(hours: string, minutes: string, key){

    let completeTime = '';
    let meridian = ''
    if(key == 'A' || key == 'a'){
      meridian = 'AM'
    }
    else{
      meridian = 'PM'
    }
    completeTime = `${hours}:${minutes} ${meridian}`;

    this._renderer.setProperty(this._el.nativeElement, 'value', completeTime);
    this._controlValueChanged();
    this._el.nativeElement.setSelectionRange(6, 7);
    this._fieldJustGotFocus = true;
  }

  /** Handle backspace or delete key event */
  _clearHoursOrMinutes() {
    const caretPosition = this._doGetCaretPosition();
    const inputvalue = this._el.nativeElement.value;
    const meridian = inputvalue.split(' ')[1];
    const input: string[] = inputvalue.split(' ')[0].split(':');

    const hours: string = input[0];
    const minutes: string = input[1];

    let newTime = '';
    let sendCaretToMinutes = false;

    if(caretPosition > 5){
      newTime = `${hours}:${minutes} XM`;
    }
    else if (caretPosition > 2) {
      newTime = `${hours}:mm ${meridian}`;
      sendCaretToMinutes = true;
    } else {
      newTime = `hh:${minutes} ${meridian}`;
      sendCaretToMinutes = false;
    }

    this._fieldJustGotFocus = true;

    this._renderer.setProperty(this._el.nativeElement, 'value', newTime);
    this._controlValueChanged();
    if(caretPosition > 5){
      this._el.nativeElement.setSelectionRange(6, 7);
    }
    else if (!sendCaretToMinutes) {
      this._el.nativeElement.setSelectionRange(0, 2);
    } else {
      this._el.nativeElement.setSelectionRange(3, 5);
    }
  }

  /** Implementation for ControlValueAccessor interface */
  writeValue(value: Date): void {
    let inputvalue = value;
    if (value && !(value instanceof Date)) {
      let regexp = new RegExp('^(0?[1-9]|1[0-2]):[0-5][0-9]?(\s*[AaPp][Mm])?')
      let test = regexp.test(value);
      if(test){
        let strvalue: string = value;
        strvalue = strvalue.replace('AM', " AM").replace('PM', " PM")
        inputvalue = new Date(new Date().toLocaleDateString()+' '+strvalue);
      }
      else{
        throw new Error('A diretive appTimeMask requires the component value to be of type Date');
      }
    }

    this._dateValue = new Date(inputvalue);

    const v = inputvalue ? this._dateToStringTime(inputvalue) : 'hh:mm XM';

    this._renderer.setProperty(this._el.nativeElement, 'value', v);
  }

  /** Implementation for ControlValueAccessor interface */
  registerOnChange(fn: (_: string) => void): void {
    this._onChange = fn;
  }

  /** Implementation for ControlValueAccessor interface */
  registerOnTouched(fn: () => void): void {
    this._touched = fn;
  }

  /** Implementation for ControlValueAccessor interface */
  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._el.nativeElement, 'disabled', isDisabled);
  }

  validate(c: FormControl): { [key: string]: any } {
    return this._el.nativeElement.value.indexOf('-') === -1 ? null : { validTime: false };
  }

  /*
  ** Returns the caret (cursor) position of the specified text field.
  ** Return value range is 0-nativeElement.value.length.
  */
  private _doGetCaretPosition(): number {

    // Initialize
    let iCaretPos = 0;

    const nativeElement = this._el.nativeElement;

    // IE Support
    if (document.hasOwnProperty('selection')) {

      // Set focus on the element
      nativeElement.focus();

      // To get  cursor position, get empty selection range
      const oSel = document['selection'].createRange();

      // Move selection start to 0 position
      oSel.moveStart('character', -nativeElement.value.length);

      // The caret position is selection length
      iCaretPos = oSel.text.length;
    } else if (nativeElement.selectionStart || nativeElement.selectionStart === '0') {
      // Firefox support
      iCaretPos = nativeElement.selectionStart;
    }

    // Return results
    return iCaretPos;
  }

  /** build 2-character string */
  private _zeroFill(value: number): string {
    return (value > 9 ? '' : '0') + value;
  }

  /** build a time in 00:00 AMformat */
  private _dateToStringTime(value: Date) {
    let timewithMeridian: string[] = value.toLocaleTimeString().split(' ')
    let meridian = timewithMeridian[1].replace('X','A');
    let timeParts = timewithMeridian[0].split(':');
    let h = Number(this._stringToNumber(timeParts[0],'h'));
    let m = Number(this._stringToNumber(timeParts[1],'m'));


    return this._zeroFill(h) + ':' + this._zeroFill(m)+' '+meridian;
  }

  /** Turns a string in format --, -X, X-, XY into a number, considering '-' => 0 */
  private _stringToNumber(str: string,chr: string) {
    if (str.indexOf(chr) === -1) {
      return Number(str);
    }

    const finalStr = str.replace(chr, '0').replace(chr, '0');

    return Number(finalStr);
  }

  /** Set the NgControl and local value  */
  private _controlValueChanged() {
    const value = this._el.nativeElement.value

    let timewithMeridian: string[] = value.split(' ')
    let meridian = timewithMeridian[1].replace('X','A');
    let timeParts = timewithMeridian[0].split(':');
    let h = Number(this._stringToNumber(timeParts[0],'h'));
    let m = Number(this._stringToNumber(timeParts[1],'m'));

    this._onChange(this._zeroFill(h) + ':' + this._zeroFill(m)+' '+meridian);
  }

}
