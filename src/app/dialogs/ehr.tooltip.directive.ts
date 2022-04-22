import { Directive, ElementRef, Renderer2, Input, HostListener, } from '@angular/core'

@Directive({
  selector: '[ehrToolTip]',
})
export class ehrTooltipDirective {

  @Input() toolTip: string;

  @Input() tickImmagePath: string;

  @Input() crossImmagePath: string;

  elToolTip: any;

  constructor(private elementRef: ElementRef,
            private renderer: Renderer2) {
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.elToolTip) { this.showHint(); }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.elToolTip) { this.removeHint(); }
  }

  ngOnInit() {
  }

  removeHint() {
    this.renderer.removeClass(this.elToolTip, 'tooltip');
    this.renderer.removeChild(document.body, this.elToolTip);
    this.elToolTip = null;
    (this.elementRef.nativeElement as HTMLInputElement).style.background = '';
  }

  showHint() {

    this.elToolTip = this.renderer.createElement('div');
    const text = this.renderer.createText(this.toolTip);
    this.renderer.appendChild(this.elToolTip, text);

    this.renderer.appendChild(document.body, this.elToolTip);
    this.renderer.addClass(this.elToolTip, 'tooltip');

    let hostPos = this.elementRef.nativeElement.getBoundingClientRect();
    let tooltipPos= this.elToolTip.getBoundingClientRect();

    let top = hostPos.top ;
    let left = hostPos.left+hostPos.width - 20;
    console.log('top: '+top+'left: '+left);


    this.renderer.setStyle(this.elToolTip, 'top', top+'px');
    this.renderer.setStyle(this.elToolTip, 'left', left+'px');
    this.renderer.setStyle(this.elToolTip, 'width', '20px');
    this.renderer.setStyle(this.elToolTip, 'height', '20px');

    (this.elementRef.nativeElement as HTMLInputElement).style.background = 'url(../../assets/images/calendar.svg) no-repeat right';
  }
}
