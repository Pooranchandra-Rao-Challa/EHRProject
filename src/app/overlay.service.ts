import { FullscreenOverlayContainer, Overlay, OverlayConfig, OverlayContainer, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import {  Injectable, Injector, NgModule, TemplateRef, Type } from '@angular/core';
import { Console } from 'console';
import { EHROverlayRef } from './ehr-overlay-ref';
import { OverlayComponent } from './overlay/overlay.component';


@Injectable()
export class OverlayService {
  constructor(private overlay: Overlay, private injector: Injector,
    private positionBuilder: OverlayPositionBuilder) { }

  open<R = any, T = any>(
    content: string | TemplateRef<any> | Type<any>,
    data: T
  ): EHROverlayRef<R> {
       let scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );

    const configs = new OverlayConfig({
      scrollStrategy : this.overlay.scrollStrategies.block(),
      hasBackdrop: true,
      panelClass: ['modal', 'is-active','ehr-custome-model'],
      backdropClass: 'modal-background',
      positionStrategy: this.positionBuilder
        .global()
        .centerHorizontally()
        .top()
    });
    document.body.scrollBy(0,-document.body.scrollTop);
    document.body.style.overflow = "hidden";
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
