import { Subject } from 'rxjs';

import { OverlayRef } from '@angular/cdk/overlay';

import { TemplateRef, Type } from '@angular/core';

export interface OverlayCloseEvent<R> {
  type: 'backdropClick' | 'close';
  data: R;
}

// R = Response Data Type, T = Data passed to Modal Type
export class EHROverlayRef<R = any, T = any> {
  afterClosed$ = new Subject<OverlayCloseEvent<R>>();

  constructor(
    public overlay: OverlayRef,
    public content: string | TemplateRef<any> | Type<any>,
    public data: T, // pass data to modal i.e. FormData,
    public popupover: boolean = false
  ) {

    overlay.backdropClick().subscribe(() => {
      //this._close('backdropClick', null)
    }

    );
  }

  get RequestData(): T {
    return this.data;
  }

  close(resdata?: R) {
    if(!this.popupover)
      document.body.style.overflow = "auto"
    this._close('close', resdata);
  }

  private _close(type: 'backdropClick' | 'close', resdata: R) {
    this.overlay.dispose();
    this.afterClosed$.next({
      type: type,
      data: resdata
    });

    this.afterClosed$.complete();
  }
}
