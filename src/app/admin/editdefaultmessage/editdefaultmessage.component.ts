import { DefaultMessage } from './../../_models/_admin/defaultmessage';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-editdefaultmessage',
  templateUrl: './editdefaultmessage.component.html',
  styleUrls: ['./editdefaultmessage.component.scss']
})
export class EditDefaultMessageComponent implements OnInit {

 defaultmessage: DefaultMessage[];


  constructor(private router:Router,private route: ActivatedRoute,private adminservice: AdminService) { }

  ngOnInit(): void {
  }

  BackDefaultMessage(name,url)
  {
    this.router.navigate(
      [url],
      { queryParams: { name: name} }
    );
 }
 getProviderList() {
  this.adminservice.GetProviderList().subscribe(resp => {
    if (resp.IsSuccess) {
      this.defaultmessage = resp.ListResult;
      //this.dataSource = resp.ListResult;
    } else
      this.defaultmessage = [];
  });
}

}

