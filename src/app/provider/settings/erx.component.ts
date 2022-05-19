import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { UtilityService } from '../../_services/utiltiy.service';
import { User, UserLocations } from '../../_models';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocationSelectService } from '../../_navigations/provider.layout/location.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'erx-settings',
  templateUrl: './erx.component.html',
  styleUrls: ['./erx.component.scss']
})
export class ErxComponent implements OnInit {
  public showkey: boolean = false;
  user:User
  erxList: any;
  constructor(private settingservice:SettingsService,private  authService: AuthenticationService){
    this.user = authService.userValue;

  }
  ngOnInit(): void {
    this.getErxList();
  }
  public togglePasswordVisibility(): void {
    this.showkey = !this.showkey;
  }
  getErxList()
  {
    var reqparams={
      providerId:this.user.ProviderId
    }
    
   this.settingservice.Erx(reqparams).subscribe(reponse=>{
    this.erxList=reponse.ListResult;
    console.log(this.erxList)
    })
  }
}
