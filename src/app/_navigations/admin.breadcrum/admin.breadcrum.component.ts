import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin.breadcrum',
  templateUrl: './admin.breadcrum.component.html',
  styleUrls: ['./admin.breadcrum.component.scss']
})
export class BreadcrumComponent implements OnInit {

  menuName:any ;
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  onChangeBreadCum(name, url) {
    this.router.navigate(
      [url],
      { queryParams: { name: name } }
    );
    console.log(url)
  }

}
