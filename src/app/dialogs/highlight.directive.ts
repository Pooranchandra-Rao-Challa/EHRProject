import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[my-high-light]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  }
})
export class HighlightDirective {
  private _defaultColor = 'blue';
  private el: HTMLElement;

  constructor(el: ElementRef) { this.el = el.nativeElement; }

  @Input('myHighlight') highlightColor: string;

  onMouseEnter() { this.highlight(this.highlightColor || this._defaultColor); }
  onMouseLeave() { this.highlight(null); }

   private highlight(color:string) {
    this.el.style.backgroundColor = color;
  }

}
