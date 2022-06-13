import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class IdService {

  public ids: string[] = [];

  public IdsFor: {} = {};

  constructor() { }

  public generate(): string {
    let isUnique = false;
    let tempId = '';

    while (!isUnique) {
      tempId = this.generator();
      if (!this.idExists(tempId)) {
        isUnique = true;
        this.ids.push(tempId);
      }
    }

    return tempId;
  }

  public remove(id: string): void {
    const index = this.ids.indexOf(id);
    this.ids.splice(index, 1);
  }

  private generator(): string {
    const isString = `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;
    return isString;
  }

  public idExists(id: string): boolean {
    return this.ids.includes(id);
  }

  private S4(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  public decrementIds(decrementFor: string): number {
    // console.log(this.IdsFor[decrementFor])
    if (this.IdsFor[decrementFor] === undefined)
      this.IdsFor[decrementFor] = 0;
    return --this.IdsFor[decrementFor]
  }
  public clearIds(decrementFor: string) {
    delete this.IdsFor[decrementFor];
  }


}
