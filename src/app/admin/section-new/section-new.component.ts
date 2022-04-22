import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-section-new',
  templateUrl: './section-new.component.html',
  styleUrls: ['./section-new.component.scss']
})
export class SectionNewComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  BackWeeklyUpdate(name,url)
  {
    this.router.navigate(
      [url],
      { queryParams: { name: name} }
    );
  }


}
