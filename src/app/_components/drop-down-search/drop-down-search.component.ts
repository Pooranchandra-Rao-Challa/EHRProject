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
import { Observable, merge, iif, EMPTY } from 'rxjs';
import {
  map,
  filter,
  mapTo,
  startWith,
  switchMap,
  delay,
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

export interface State {
  flag: string;
  name: string;
  population: string;
}
@Component({
  selector: 'app-drop-down-search',
  templateUrl: './drop-down-search.component.html',
  styleUrls: ['./drop-down-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropDownSearchComponent implements OnInit {
  showPanel$: Observable<boolean>;

  @Input()  Values = [];
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

  constructor(
    private focusMonitor: FocusMonitor,
    private scrollStrategies: ScrollStrategyOptions
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

    this.textCtrl.valueChanges.subscribe((searchText)=>{
      if(!this.updatingSelection)
      this.searchTextChanged.emit(searchText);
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
    (this.inputEl.nativeElement as MatInput).value = text;
    this.connectedOverlay.overlayRef.detach();
    this.selectedOptionChanged.emit(sel);
    this.updatingSelection = false;
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
