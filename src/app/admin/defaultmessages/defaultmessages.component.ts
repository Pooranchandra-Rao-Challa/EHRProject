import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-defaultmessages',
  templateUrl: './defaultmessages.component.html',
  styleUrls: ['./defaultmessages.component.scss']
})
export class DefaultMessagesComponent implements OnInit {

  constructor( private router: Router,) { }

  ngOnInit(): void {
  }

  onSubmit(name,url){
    this.router.navigate(
      [url],
      { queryParams: { name: name,edit:'Edit default messages'} }
    );

   // this.router.navigate(['admin/editdefaultmessage'])
}
}
