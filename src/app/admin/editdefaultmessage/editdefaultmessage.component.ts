import { ViewModel } from './../../_models/_account/registration';
import { DefaultMessage } from './../../_models/_admin/defaultmessage';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/_models';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';

@Component({
  selector: 'app-editdefaultmessage',
  templateUrl: './editdefaultmessage.component.html',
  styleUrls: ['./editdefaultmessage.component.scss']
})
export class EditDefaultMessageComponent implements OnInit {

 defaultMessage: DefaultMessage;

  constructor(private router:Router,
    private route: ActivatedRoute,
    private adminservice: AdminService,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    private adminService: AdminService) {
    this.defaultMessage = this.authService.viewModel.DefaultMessageView;
   }

  ngOnInit(): void {
  }

  BackDefaultMessage(name,url)
  {
    this.router.navigate(
      [url],
      { queryParams: { name: name} }
    );
 }

 UpdateDefaultMessage() {
    this.adminService.UpdateDefaultMessage(this.defaultMessage).subscribe(resp => {
      if(resp.IsSuccess) {
        this.BackDefaultMessage('Default Message','admin/defaultmessage');
        this.alertmsg.displayMessageDailog(ERROR_CODES["M1DM001"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E1A001"]);
      }
    });
 }
//  getProviderList() {

//   this.adminservice.GetProviderList().subscribe(resp => {
//     if (resp.IsSuccess) {
//       this.defaultmessage = resp.ListResult;
//       //this.dataSource = resp.ListResult;
//     } else
//       this.defaultmessage = [];
//   });
// }

}

