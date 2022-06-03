
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable, merge, iif, EMPTY,Subject,of } from 'rxjs';
import {
  map,
  filter,
  mapTo,
  startWith,
  switchMap,
  delay,debounceTime,distinctUntilChanged,tap
} from 'rxjs/operators';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatInput } from '@angular/material/input';
import {
  CdkConnectedOverlay,
  ConnectedPosition,
  ScrollStrategyOptions,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { FormControl } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayReference } from '@angular/cdk/overlay/overlay-reference';
import { UtilityService } from '../../_services/utiltiy.service'
import { MedicalCode } from '../../_models/codes';
import { JsonExporterService, Options } from 'mat-table-exporter';


@Component({
  selector: 'app-drop-down-search',
  templateUrl: './drop-down-search.component.html',
  styleUrls: ['./drop-down-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropDownSearchComponent implements OnInit {
  showPanel$: Observable<boolean>;
  filteredValues$: Observable<MedicalCode[]>;


  @Input()  Values: MedicalCode[] = [];
  @Input()  CodeSystem: string = "";
  @Input()  DisplayWithCode: boolean =false;
  @Input()  UseAsDropdown: boolean = false;
  @Output() searchTextChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedOptionChanged: EventEmitter<string> =new EventEmitter<string>();

  updatingSelection: boolean = false;

  textCtrl = new FormControl();
  isCaseSensitive: boolean = false;
  positions: ConnectedPosition[] = [
    {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: -21,
    },
    {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      panelClass: 'no-enogh-space-at-bottom',
    },
  ];

  scrollStrategy: ScrollStrategy;

  @ViewChild(MatInput, { read: ElementRef, static: true })
  private inputEl: ElementRef;

  @ViewChild(CdkConnectedOverlay, { static: true })
  private connectedOverlay: CdkConnectedOverlay;

  private isPanelVisible$: Observable<boolean>;
  private isPanelHidden$: Observable<boolean>;
  private isOverlayDetached$: Observable<void>;

  private searchTerms = new Subject<string>();

  constructor(
    private focusMonitor: FocusMonitor,
    private scrollStrategies: ScrollStrategyOptions,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.scrollStrategy = new ConfirmScrollStrategy(this.inputEl);

    this.isPanelVisible$ = this.focusMonitor.monitor(this.inputEl).pipe(
      filter((focused) => !!focused),
      mapTo(true)
    );
    this.isOverlayDetached$ = this.isPanelVisible$.pipe(
      delay(0),
      switchMap(() =>
        iif(
          () => !!this.connectedOverlay.overlayRef,
          this.connectedOverlay.overlayRef.detachments(),
          EMPTY
        )
      )
    );
    this.isPanelHidden$ = merge(
      this.isOverlayDetached$,
      this.connectedOverlay.backdropClick
    ).pipe(mapTo(false));
    this.showPanel$ = merge(this.isPanelHidden$, this.isPanelVisible$);

    this.searchTerms
      .pipe(debounceTime(300),  // wait for 300ms pause in events
        distinctUntilChanged())   // ignore if next search term is same as previous
      .subscribe((term) =>
        this.utilityService.MedicalCodes(term,this.CodeSystem)
          .subscribe(resp => {
           if (resp.IsSuccess) {
              this.Values = resp.ListResult as MedicalCode[];
              this.filteredValues$ = of(this.Values);
            }
          })
      );

    this.textCtrl.valueChanges.subscribe((searchText)=>{
      if(!this.updatingSelection){
        if(this.CodeSystem == ""){

          this.searchTextChanged.emit(searchText);
        }else{
          if(searchText.length == 5 && this.CodeSystem.toLowerCase() == "snomed")
            this.searchTerms.next(searchText);
          else if(searchText.length >= 1 && searchText.length <= 5 && this.CodeSystem.toLowerCase() != "snomed")
            this.searchTerms.next(searchText);
        }
      }
    })

  }

  setCaseSensitive({ checked }: MatSlideToggleChange) {
    this.isCaseSensitive = checked;
  }


  private caseCheck(value: string) {
    return this.isCaseSensitive ? value : value.toLowerCase();

  }
  onSelection(sel: string,text: string){
    this.updatingSelection = true;
    let textWithCode = text;
    if(this.DisplayWithCode) textWithCode = sel+" - "+text;
    if(this.UseAsDropdown)
      (this.inputEl.nativeElement as MatInput).value = textWithCode;
    else
      (this.inputEl.nativeElement as MatInput).value = "";
    var valueToSend = JSON.stringify({Code:sel,Description: text})
    this.connectedOverlay.overlayRef.detach();
    this.selectedOptionChanged.emit(valueToSend);
    this.updatingSelection = false;
    this.Values = [] as MedicalCode[];
    this.filteredValues$ = of(this.Values);
  }
}

class ConfirmScrollStrategy implements ScrollStrategy {
  _overlay: OverlayReference;

  constructor(private inputRef: ElementRef) {}

  attach(overlayRef: OverlayReference) {
    this._overlay = overlayRef;
  }

  enable() {
    document.addEventListener('scroll', this.scrollListener);
  }

  disable() {
    document.removeEventListener('scroll', this.scrollListener);
  }

  private scrollListener = () => {
    if (confirm('The overlay will be closed. Procced?')) {
      this._overlay.detach();
      this.inputRef.nativeElement.blur();
      return;
    }
    this._overlay.updatePosition();
  };


}
