import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  isAddAdmin: boolean = false;
  isSave: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }
  isView() {
    this.isSave = true;
    this.isAddAdmin = false;
  }
  onAddAdmin() {
    this.isAddAdmin = true;
    this.isSave = false;
  }
}
