import { Overlay, OverlayConfig, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, Injector, TemplateRef, Type } from '@angular/core';
import { EHROverlayRef } from './ehr-overlay-ref';
import { OverlayComponent } from './overlay/overlay.component';

@Injectable()
export class OverlayService {
  constructor(private overlay: Overlay, private injector: Injector,
    private positionBuilder: OverlayPositionBuilder,) { }

  open<R = any, T = any>(
    content: string | TemplateRef<any> | Type<any>,
    data: T
  ): EHROverlayRef<R> {
    const configs = new OverlayConfig({

      hasBackdrop: true,
      //height:"1200px",
      panelClass: ['modal', 'is-active','ehr-custome-model'],
      backdropClass: 'modal-background',
      positionStrategy: this.positionBuilder
        .global()
        .centerHorizontally()

        .centerVertically(),
    });

    const overlayRef = this.overlay.create(configs);

    const myOverlayRef = new EHROverlayRef<R, T>(overlayRef, content, data);

    const injector = this.createInjector(myOverlayRef, this.injector);
    overlayRef.attach(new ComponentPortal(OverlayComponent, null, injector));

    return myOverlayRef;
  }

  createInjector(ref: EHROverlayRef, inj: Injector) {
    const injectorTokens = new WeakMap([[EHROverlayRef, ref]]);

    return new PortalInjector(inj, injectorTokens);
  }
}
