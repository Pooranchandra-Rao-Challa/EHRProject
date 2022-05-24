import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  AduthorizesModal = "none";
  AddAduthorizesModal="none";
  constructor() { }

  ngOnInit(): void {
  }

  DisplayAduthorizes()
  {
    this.AduthorizesModal = "block";
  }

  AddAuthorized()
  {
    this.AddAduthorizesModal="block";
  }

}
