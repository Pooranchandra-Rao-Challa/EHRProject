import { Directive, Input, OnDestroy } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Directive({
  selector: '[appAutocompletePosition]',
  exportAs : 'appAutocompletePosition'
})
export class AutocompletePositionDirective implements OnDestroy {
  public constructor(
    private readonly matAutocompleteTrigger: MatAutocompleteTrigger,
  ) {
    window.addEventListener('scroll', this.scrollEvent, true);
  }

  public ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollEvent, true);
  }

  private scrollEvent = (): void => {
    if (this.matAutocompleteTrigger == null) {
      return;
    }
    if (this.matAutocompleteTrigger.panelOpen) {
      this.matAutocompleteTrigger.updatePosition();
    }
  }
}
