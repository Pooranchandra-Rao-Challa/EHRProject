import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DefaultMessage } from 'src/app/_models/_admin/defaultmessage';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-defaultmessages',
  templateUrl: './defaultmessages.component.html',
  styleUrls: ['./defaultmessages.component.scss']
})
export class DefaultMessagesComponent implements OnInit {

  defaultmessage: DefaultMessage[];

  constructor( private router: Router,private adminservice: AdminService) { }

  ngOnInit(): void {
    this.getDefaultMessage();
  }

  onSubmit(name,url){
    this.router.navigate(
      [url],
      { queryParams: { name: name,edit:'Edit default messages'} }
    );
    }
    getDefaultMessage() {
      this.adminservice.DefaultMessages().subscribe(resp => {
        if (resp.IsSuccess) {
          this.defaultmessage = resp.ListResult;
        } else
          this.defaultmessage = [];
      });
    }

}

