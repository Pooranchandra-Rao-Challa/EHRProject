import { Component } from '@angular/core';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent {

  isPast:boolean=false;
  isUpcoming:boolean=true;
  constructor() { }

  ngOnInit(): void {
  }
  onUpcoming(){
    this.isUpcoming=true;
    this.isPast=false;
  }
  onPast(){
    this.isUpcoming=false;
    this.isPast=true;
  }
}
