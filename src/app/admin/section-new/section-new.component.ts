import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-section-new',
  templateUrl: './section-new.component.html',
  styleUrls: ['./section-new.component.scss']
})
export class SectionNewComponent implements OnInit {
  menuName: any;
  displayHeading:string=''
  constructor(private router:Router,private route: ActivatedRoute,) { }

  ngOnInit(): void {
  this.getComponentName()
  }

  BackWeeklyUpdate(name,url)
  {
    this.router.navigate(
      [url],
      { queryParams: { name: name} }
    );
  }

 getComponentName() {
   //debugger;
    this.route.queryParams.subscribe((params) => {
      console.log(params.edit)
      if (params.name != null) {
        if(params.edit == 'EditSection')
        {
          this.displayHeading = 'Edit Section'
        }
        else{
          this.displayHeading = 'Add new Section'
        }
        this.menuName = params.name;
      }
    });
  }

}
