import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: "conditionpadder",
})
export class ConditionpadderPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) { }
  transform(value: number, LineIndex: number): any {
    debugger;
    let paddingmultiplier: number = 30;
    let linemultiplier: number = 20;
    if (LineIndex > 0) {
      return this.sanitizer.bypassSecurityTrustStyle(
        "padding-left:" +
        value * paddingmultiplier +
        "px; padding-top:" +
        LineIndex * linemultiplier +
        "px;"
      );
    } else {
      return this.sanitizer.bypassSecurityTrustStyle(
        "padding-left:" + value * paddingmultiplier + "px;"
      );
    }
  }
}
