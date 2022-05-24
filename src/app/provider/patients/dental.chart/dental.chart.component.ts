import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dentalchart',
  templateUrl: './dental.chart.component.html',
  styleUrls: ['./dental.chart.component.scss']
})
export class DentalChartComponent implements OnInit {

  AdultPrem:boolean=true;
  ChilPrim:boolean=false;
  checboxList:any=[];
  displayStyle = "none";
  DentalNumber:number;

  constructor() { }

  ngOnInit( ): void {
    this.GetList();
    this.CheckboxExpand();

  }

  GetList()
  {
    this.checboxList=[
      {listId:"1",listName:'D0120 periodic oral evaluation - established patient'},
      {listId:"2",listName:'D0120 periodic oral evaluation - established patient'},
      {listId:"3",listName:'D0120 periodic oral evaluation - established patient'}
    ]
  }
  AdultPerm()
  {
    this.AdultPrem=true;
    this.ChilPrim=false;
    this.CheckboxExpand();
  }

  ChildPrim(){
   this.AdultPrem=false;
   this.ChilPrim=true;
   this.CheckboxExpand();
  }

  CheckboxExpand(){
    var checks = document.querySelectorAll("input[type=checkbox]");
    for(var i = 0; i < checks.length; i++){
      checks[i].addEventListener( 'change', function() {
        if(this.checked) {
           showChildrenChecks(this);
        } else {
           hideChildrenChecks(this)
        }
      });
    }
    function showChildrenChecks(elm) {
       var pN = elm.parentNode;
       var childCheks = pN.children;
      for(var i = 0; i < childCheks.length; i++){
          if(hasClass(childCheks[i], 'child-check')){
              childCheks[i].classList.add("active");
          }
      }
    }
    function hideChildrenChecks(elm) {
       var pN = elm.parentNode;
       var childCheks = pN.children;
      for(var i = 0; i < childCheks.length; i++){
          if(hasClass(childCheks[i], 'child-check')){
              childCheks[i].classList.remove("active");
          }
      }
    }
    function hasClass(elem, className) {
        return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
    }
  }

  OpenDentalModal(number) {
    this.DentalNumber=number;
    this.displayStyle = "block";
  }

  CloseDentalModal()
  {
    this.displayStyle = "none";
  }
}
