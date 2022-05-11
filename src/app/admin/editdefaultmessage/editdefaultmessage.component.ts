import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editdefaultmessage',
  templateUrl: './editdefaultmessage.component.html',
  styleUrls: ['./editdefaultmessage.component.scss']
})
export class EditDefaultMessageComponent implements OnInit {

  constructor(private router:Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  BackDefaultMessage(name,url)
  {
    this.router.navigate(
      [url],
      { queryParams: { name: name} }
    );
 }
// getComponentName() {
//   //debugger;
//    this.route.queryParams.subscribe((params) => {
//      console.log(params.edit)
//      if (params.name != null) {
//        if(params.edit == 'EditSection')
//        {
//          this.displayHeading = 'Edit Section'
//        }
//        else{
//          this.displayHeading = 'Add new Section'
//        }
//        this.menuName = params.name;
//      }
//    });
//  }
}

