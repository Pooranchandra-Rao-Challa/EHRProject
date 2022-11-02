import { Accountservice } from 'src/app/_services/account.service';
import { User, ViewModel } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { ProviderHeader, NotifyProviderHeaderService } from 'src/app/_navigations/provider.layout/view.notification.service';

export class Locked {
  Email?: string;
  Password?: string;
  UnLockToken?: string;
}
@Component({
  selector: 'app-locked',
  templateUrl: './locked.component.html',
  styleUrls: ['./locked.component.scss']
})
export class LockedComponent implements OnInit {
  unLock: Locked = new Locked();

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private accountService: Accountservice,
    private notifyProviderHeader: NotifyProviderHeaderService,
    private authServer: AuthenticationService) {
   }

  ngOnInit(): void {
  }

  invalidPassword: boolean = false;

  updateLock(){
    this.unLock.Email = this.authService.userValue.Username;
    this.unLock.UnLockToken = this.authService.userValue.UnlockToken;
    this.accountService.ReleaseUserLock(this.unLock).subscribe(resp => {
      if(resp.Result){
        this.ref.close(null);
        this.authService.userValue.UserLocked = false;
        localStorage.setItem('user', JSON.stringify(this.authService.userValue as User));
      }
      else {
        this.invalidPassword = true;
      }
    });
  }

}
