import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-defaultmessages',
  templateUrl: './defaultmessages.component.html',
  styleUrls: ['./defaultmessages.component.scss']
})
export class DefaultmessagesComponent implements OnInit {

  constructor( private router: Router,) { }

  ngOnInit(): void {
  }
  onSubmit() {  
    this.router.navigate(['admin/editdefaultmessage'])  
} 
}
