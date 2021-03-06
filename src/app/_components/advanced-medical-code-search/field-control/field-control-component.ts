
import { MatInput } from '@angular/material/input';
import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Component,
  OnInit,
  Input,
  HostBinding,
  ViewChild,
  ElementRef,
  OnDestroy,
  Optional,
  Self,
  DoCheck,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject,Observable,of } from 'rxjs';
import {
  NgControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import {
  ErrorStateMatcher,
  CanUpdateErrorStateCtor,
  mixinErrorState,
  mixinDisabled,
  CanDisableCtor,
} from '@angular/material/core';
import { take,debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';
import { UtilityService } from '../../../_services/utiltiy.service'
import { MedicalCode,CodeSystemGroup } from '../../../_models/codes';

export interface FormFieldValue {
  query: string;
  scope: string;
}
// export interface SelectionData{
//   code: string;
//   description: string;
// }
export class CustomErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl): boolean {
    return control.dirty && control.invalid;
  }
}


class SearchInputBase {
  constructor(
    public _parentFormGroup: FormGroupDirective,
    public _parentForm: NgForm,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public ngControl: NgControl
  ) {}
}

const _SearchInputMixiBase: CanUpdateErrorStateCtor &
  CanDisableCtor = mixinDisabled(mixinErrorState(SearchInputBase));


@Component({
  selector: 'form-field-control',
  templateUrl: 'field-control-component.html',
  styleUrls: ['field-control-component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: FieldControlComponent,
    },
    {
      provide: ErrorStateMatcher,
      useClass: CustomErrorMatcher,
    },
  ],
})
export class FieldControlComponent extends _SearchInputMixiBase
  implements
    OnInit,
    OnDestroy,
    MatFormFieldControl<FormFieldValue>,
    ControlValueAccessor,
    DoCheck {
  static nextId = 0;
  @ViewChild(MatInput, { read: ElementRef, static: true })
  input: ElementRef;
  @Input()
  set value(value: FormFieldValue) {
    this.form.patchValue(value);
    this.stateChanges.next();
  }
  get value() {
    return this.form.value;
  }

  @HostBinding()
  id = `medical-code-form-field-id-${FieldControlComponent.nextId++}`;

  @Input()
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  get placeholder() {
    return this._placeholder;
  }
  private _placeholder: string;

  focused: boolean;

  get empty(): boolean {
    return !this.value.query && !this.value.scope;
  }

  @HostBinding('class.floated')
  get shouldLabelFloat(): boolean {
    return true;
  }

  @Input()
  required: boolean;

  @Input()
  disabled: boolean;

  @Input()
  codeSystems: string[]= [];

  @Input()
  hideCodeSystem: boolean = true;

  controlType = 'medical-code-form-field';

  @HostBinding('attr.aria-describedby') describedBy = '';

  onChange: (value: FormFieldValue) => void;
  onToutch: () => void;

  form: FormGroup;

  @Output() optionValueChanged: EventEmitter<MedicalCode> =new EventEmitter<MedicalCode>();

  filteredOptions: Observable<CodeSystemGroup[]>;

  minLengthTerm: number = 5;

  @Input()
  MinTermLength:number = 5

  isLoading: boolean = false;

  @Input()
  set selectedValue(value: MedicalCode){
    //console.log(value);

    this._selectedValue = value;
  }
  get selectedValue() {
    return this._selectedValue;
  }
  private _selectedValue

  @Input()
  ShowSelectedValue: boolean = true;





  constructor(
    private focusMonitor: FocusMonitor,
    @Optional() @Self() public ngControl: NgControl,
    private fb: FormBuilder,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    private utilityService: UtilityService
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);


    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    this.form = this.fb.group({
      scope: new FormControl(''),
      query: new FormControl(''),
    });
   // (this.form.contains[1] as FormControl).
  }

  writeValue(obj: FormFieldValue): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onToutch = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.form.disable();
    this.stateChanges.next();
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(): void {
    this.focusMonitor.focusVia(this.input, 'program');
  }

  ngOnInit(): void {
    this.focusMonitor.monitor(this.input).subscribe((focused) => {
      this.focused = !!focused;
      this.stateChanges.next();
    });
    this.focusMonitor
      .monitor(this.input)
      .pipe(take(1))
      .subscribe(() => {
        this.onToutch();
      });
    this.form.valueChanges.pipe(
      filter(res => {
        if(res.query != null && res.query.length < this.MinTermLength) {
          this.isLoading = false;
          this.filteredOptions = of([]);
        }
        return res !== null && res.query != null && res.query.length >= this.MinTermLength
      }),
      debounceTime(700),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
    )
    .subscribe((value) =>
    {
        this.onChange(value);
        this.updateSearchResults(value)
    });

  }

  updateSearchResults(term: FormFieldValue){
    if(term.query.length >= this.MinTermLength && term.scope != ""){
      this.utilityService.MedicalCodes(term.query,term.scope)
        .subscribe(resp => {
        this.isLoading = false;
         if (resp.IsSuccess) {
            this.filteredOptions = of(
              groupBy(
                  resp.ListResult as MedicalCode[],
                  codesystem => codesystem.CodeSystem));
          } else this.filteredOptions = of([]);
        })
    }else this.filteredOptions = of([]);
  }

  onSelected() {
   this.optionValueChanged.emit(this.selectedValue)
  }

  displayWith(value: MedicalCode){
    if(!value) return "";
    return value.Code+"-"+value.Description;
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  ngOnDestroy() {
    this.focusMonitor.stopMonitoring(this.input);
    this.stateChanges.complete();
  }
}
// export class MedicalCodeGroup{
//   key: string;
//   codes: MedicalCode[];
// }
function groupBy<_string, _MedicalCode>(array: MedicalCode[], grouper: (item: MedicalCode) => string) {
  let rtnValue =  array.reduce((store, item) => {
    var key = grouper(item)
    if (!store.has(key)) {
      store.set(key, [item])
    } else {
      store.get(key).push(item)
    }
    return store;
  }, new Map<string, MedicalCode[]>())

  let codeSystemObject: CodeSystemGroup[] = [];
  rtnValue.forEach((values: MedicalCode[], mykey: string) => {
    codeSystemObject.push({ name: mykey, codes: values })
  });
  return codeSystemObject;
}
