import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { UtilityService } from '../../_services/utiltiy.service';
import { User, UserLocations } from '../../_models';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocationSelectService } from '../../_navigations/provider.layout/view.notification.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'access-permission-settings',
  templateUrl: './access.permission.component.html',
  styleUrls: ['./settings.component.scss']
})
export class AccessPermissionComponent implements OnInit {
  ngOnInit(): void {}
}
