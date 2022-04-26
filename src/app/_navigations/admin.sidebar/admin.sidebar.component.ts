import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin.sidebar.component.html',
  styleUrls: ['./admin.sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    var dropdown = document.getElementsByClassName("dropdown-btn");
    for (var i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", function () {
        var dropdown = this.nextElementSibling;
        if (dropdown.style.display === "block") {
          dropdown.style.display = "none";
        } else {
          dropdown.style.display = "block";
        }
      });
    }
  }

  onChangeBreadCrum(name, url) {
    this.router.navigate(
      [url],
      { queryParams: { name: name } }
    );
  }


}
