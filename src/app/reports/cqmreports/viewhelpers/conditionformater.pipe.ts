import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: "conditionformater",
})
export class ConditionformaterPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) { }
  transform(value: any, crossmark, tickmark): any {
    debugger;
    var cross: string = "<span class='" +
      crossmark +
      "' style='color: #a63b12;background-color: #edd8d0;'>✗</span>";
    var tick = "<span class='" +
      tickmark +
      "'  style='color: #41b6a6;background-color: #e5f8f5;'>✓</span>";
    return this.sanitizer.bypassSecurityTrustHtml(
      this.replaceAll(this.replaceAll(value, '[0]', cross), "[1]", tick)
    );
  }

  replaceAll(str, search, replace): string {
    return str.split(search).join(replace);
  }
}
