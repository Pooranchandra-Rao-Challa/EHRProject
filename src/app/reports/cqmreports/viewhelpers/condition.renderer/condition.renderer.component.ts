import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "condition-renderer",
  templateUrl: "./condition.renderer.component.html",
  styleUrls: ["./condition.renderer.component.scss"],
})
export class Condition implements OnInit {
  panelOpenState: boolean = false;
  @Input() public Conditions: [];
  constructor() { }
  ngOnInit() { }
}
