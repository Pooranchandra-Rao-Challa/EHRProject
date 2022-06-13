import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-breadcrum',
  templateUrl: './admin.breadcrum.component.html',
  styleUrls: ['./admin.breadcrum.component.scss']
})
export class BreadcrumComponent implements OnInit {

  menuName: any = 'Practices';
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getComponentName();
  }

  getComponentName() {
    this.route.queryParams.subscribe((params) => {
      if (params.name != null) {
        this.menuName = params.name;
      }
    });
  }
  onChangeBreadCum(name, url) {
    this.router.navigate(
      [url],
      { queryParams: { name: name } }
    );
    // console.log(url)
  }


}
