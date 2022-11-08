import { NotifyMessageService } from 'src/app/_navigations/provider.layout/view.notification.service';


import { Component, EventEmitter, OnInit, Output, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services/authentication.service';
import { User, UserLocations, ViewModel } from '../../_models';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientProfile } from 'src/app/_models/_patient/patientprofile';
import { PatientService } from 'src/app/_services/patient.service';
import { LoaderService } from 'src/app/_loader/loader.service';
declare var $: any;

@Component({
  selector: 'app-patient-navbar',
  templateUrl: './patient.navbar.component.html',
  styleUrls: ['./patient.navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class PatientNavbarComponent implements OnInit,AfterViewInit {
  navbarOpen: boolean = false;
  user: User;
  view: string;
  locationsInfo: UserLocations[];
  currentLocation: string;
 // name: string;
  PatientProfile: PatientProfile;
  viewModel: ViewModel;
  @Output() Bredcrumchanged = new EventEmitter<String>();
  menuwidth: number;
  unreadMails: number = 0;
  urgentMails: number = 0;

  constructor(private authenticationService: AuthenticationService, private patientService: PatientService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private notifyMessage: NotifyMessageService,
    public loaderService: LoaderService) {
    this.user = authenticationService.userValue;
    this.unreadMails = this.user.UnReadMails;
    this.urgentMails = this.user.UrgentMessages;
    this.locationsInfo = JSON.parse(this.user.LocationInfo);
    this.viewModel = authenticationService.viewModel as ViewModel;
    if(this.viewModel == null){
      this.viewModel = new ViewModel();
    }
  }
  ngAfterViewInit(): void {
    this.menuwidth = (document.getElementById('UserDropdown').clientWidth+8);
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    //this.name = this.viewModel.View;
    this.getPatientProfile();
    this.notifyMessage.getData().subscribe(value => {
      this.unreadMails = value.UnreadCount;
      this.urgentMails = value.UrgentCount;
    });
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  logout() {
    this.authenticationService.logout();
  }
  getPatientProfile() {

    var req = {
      "PatientId": this.user.PatientId,
    }
    this.patientService.PatientMyProfileByPatientId(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientProfile = resp.ListResult[0];
      }
    });
  }
  onChangeBreadCrum(url: string, name: string, view?: string,) {
    this.authenticationService.SetViewParam("View", name)
    if (view != null) {
      this.authenticationService.SetViewParam("SubView", view)
    }
    this.viewModel = this.authenticationService.viewModel;
    if (url == 'provider/patients') this.viewModel.PatientBreadCrumb = [];
    this.Bredcrumchanged.emit(name);
    this.router.navigate(
      [url],
    );
  }
  get LoggedInUser()
  {
    if( this.user.Role == "representative") return this.user.RepresentativeName;
    else return this.user.FirstName +' '+ this.user.LastName;

  }
}
