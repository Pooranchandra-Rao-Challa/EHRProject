import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-breadcrum',
  templateUrl: './breadcrum.component.html',
  styleUrls: ['./breadcrum.component.scss']
})
export class BreadcrumComponent implements OnInit {
  menuName: any;
  isSubscribe: boolean = false;

  constructor(private router: Router, private location: Location,
    private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.getComponentName()
  }

  getComponentName() {
    this.route.queryParams.subscribe((params) => {
      if (params.name != null) {
        this.menuName = params.name;
      }
    });
  }

}
