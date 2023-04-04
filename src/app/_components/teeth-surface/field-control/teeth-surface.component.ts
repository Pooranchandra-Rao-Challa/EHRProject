import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { Observable, merge, iif, EMPTY } from 'rxjs';
import {
  filter,
  mapTo,
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
import { OverlayReference } from '@angular/cdk/overlay/overlay-reference';
import { TOOTH_PROBLEM_PLACES } from 'src/app/_models';


@Component({
  selector: 'app-teeth-surface',
  templateUrl: './teeth-surface.component.html',
  styleUrls: ['./teeth-surface.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeethSurfaceComponent implements OnInit {
  showPanel$: Observable<boolean>;

  teethCtrl = new FormControl();
  // filteredStates$: Observable<State[]>;
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
  private _selectedOption: string;
  @Output() optionValueChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Input()
  get selectedOption(): string{ return TOOTH_PROBLEM_PLACES[this._selectedOption];}
  set selectedOption(v: string){ this._selectedOption = v;}
  @Input() selectedOptions: string[] = [];
  teethProblems:{} = TOOTH_PROBLEM_PLACES;

  constructor(
    private focusMonitor: FocusMonitor,
    private scrollStrategies: ScrollStrategyOptions
  ) { }

  ngOnInit(): void {
    this.scrollStrategy = new ConfirmScrollStrategy(this.inputEl);

    if(this._selectedOption != null)
    this.teethCtrl.setValue(this.selectedOption);
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
  }

  onOptionSelected(value) {
    // let i = this.selectedOptions.indexOf(value);
    // i < 0 ? this.selectedOptions.push(value)
    //   : this.selectedOptions.splice(i, 1);

    // this.teethCtrl.setValue(this.selectedOptions.join(","));
    // this.optionValueChanged.emit(this.selectedOptions);

    this._selectedOption = value;
    this.teethCtrl.setValue(TOOTH_PROBLEM_PLACES[value]);
    this.optionValueChanged.emit(value);

    this.connectedOverlay.overlayRef.detach();
    this.inputEl.nativeElement.blur();
  }
  closePopup() {
    this.connectedOverlay.overlayRef.detach();
    this.inputEl.nativeElement.blur();
  }
}

class ConfirmScrollStrategy implements ScrollStrategy {
  _overlay: OverlayReference;

  constructor(private inputRef: ElementRef) { }

  attach(overlayRef: OverlayReference) {
    this._overlay = overlayRef;
  }

  enable() {
    //document.addEventListener('scroll', this.scrollListener);
  }

  disable() {
    //document.removeEventListener('scroll', this.scrollListener);
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
