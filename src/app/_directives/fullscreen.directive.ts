import { Directive, HostListener, OnChanges, Input, ElementRef } from '@angular/core';

@Directive({
    selector: '[ngxToggleFullscreen]'
})
export class ToggleFullscreenDirective implements OnChanges {

    @Input('ngxToggleFullscreen')
    isFullscreen: boolean = true;

    constructor(private el: ElementRef) { }

    ngOnChanges() {
        if (this.isFullscreen) {
            let i = this.el.nativeElement;
            if (i.requestFullscreen) {
              i.requestFullscreen();
            } else if (i.requestFullScreen) {
              i.requestFullScreen();
            } else if (i.webkitRequestFullscreen) {
              i.webkitRequestFullscreen();
            } else if (i.webkitRequestFullScreen) {
              i.webkitRequestFullScreen();
            } else if (i.mozRequestFullScreen) {
              i.mozRequestFullScreen();
            } else if (i.msRequestFullscreen) {
              i.msRequestFullscreen();
            }
          }
        // } else{
        //     if (document.exitFullscreen) {
        //       document.exitFullscreen();
        //     } else if (document.webkitExitFullscreen) {
        //       document.webkitExitFullscreen();
        //     } else if (document.mozCancelFullScreen) {
        //       document.mozCancelFullScreen();
        //     } else if (document.msExitFullscreen) {
        //       document.msExitFullscreen();
        //     }
        // }
    }

}
