import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin.sidebar.component.html',
  styleUrls: ['./admin.sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    let arrow = document.querySelectorAll(".arrow");
    for (var i = 0; i < arrow.length; i++) {
      arrow[i].addEventListener("click", (e) => {
        let arrowParent = (e.target as HTMLInputElement).parentNode;//selecting main parent of arrow
        arrowParent.parentElement.classList.toggle("showMenu");
      });
    }

    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector(".bx-menu");
    let homeSection = document.querySelector(".home-section");
    console.log(sidebarBtn);
    sidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("close");
      homeSection.classList.toggle("left-space")
    });
  }

  onChangeBreadCrum(name,url){
    this.router.navigate(
      [url],
      { queryParams: { name: name} }
    );
  }


}
