import { Directive, ElementRef,  Input, HostListener, } from '@angular/core'

@Directive({
  selector: '[mouse-over-hint]',
})
export class MouseOverHintDirective {

  @Input() tickImagePath: string;

  @Input() crossImagePath: string;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.showHint();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.removeHint();
  }

  @HostListener('mouseover')
  onMouseOver() {
    this.showHint();
  }

  @HostListener('mouseout')
  onMouseOut() {
    this.removeHint();
  }
  ngOnInit() {
  }

  removeHint() {
    let elem: HTMLInputElement = (this.elementRef.nativeElement as HTMLInputElement);
    elem.style.background = '';
    elem.style.backgroundSize = '';
    elem.style.backgroundPositionX = '';
  }

  showHint() {


    let elem: HTMLInputElement = (this.elementRef.nativeElement as HTMLInputElement);
    let req = elem.attributes.getNamedItem("required");
    if(req != null){
      if(elem.value != '')
        elem.style.background = 'url('+this.tickImagePath+') no-repeat right';
      else
        elem.style.background = 'url('+this.crossImagePath+') no-repeat right';

      elem.style.backgroundSize = '20px 20px';
      elem.style.backgroundPositionX = (elem.clientWidth - 22)+'px';

    }
  }
}
