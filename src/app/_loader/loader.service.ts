import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs-compat';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public progressValue: number = 20;

  constructor() { }
}
