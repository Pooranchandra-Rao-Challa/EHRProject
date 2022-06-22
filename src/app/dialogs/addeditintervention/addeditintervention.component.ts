import { Router, RouterModule } from '@angular/router';
import { CQMNotPerformed } from 'src/app/_models/_provider/cqmnotperformed';
import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { User } from 'src/app/_models';
import { CQMNotPerformedService } from 'src/app/_services/cqmnotperforemed.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-addeditintervention',
  templateUrl: './addeditintervention.component.html',
  styleUrls: ['./addeditintervention.component.scss']
})
export class AddeditinterventionComponent implements OnInit {

  itemNotPerformed:any=[
    { Id: '1', value: 'Current Meds Documented'},
    { Id: '2', value: 'BMI Screening/Follow-up'},
    { Id: '3', value: 'Tobacco Use Screening/Cessation Counseling'}
  ]
  interventaionType:any=[
    { Id: '1', value: 'BMI-Above Normal Follow-up'},
    { Id: '2', value: 'BMI-Above Normal Medication'},
    { Id: '3', value: 'BMI-Referrals where weight assessement may occur'},
    { Id: '4', value: 'BMI-Below Normal Follow-up'},
    { Id: '5', value: 'BMI-Below Normal Medication'},
    { Id: '6', value: 'Weight-Counseling for Physical Activity'}
  ]
  searchReason:any =[
    { Id: '1', value: '105480006 - Refusal of treatment by patient (situation)' },
    { Id: '2', value: '183944003 - Procedure refused (situation)' },
    { Id: '3', value: '183945002 - Procedure refused for religious reason (situation)' },
    { Id: '4', value: '413310006 - Patient non-compliant - refused access to services (situation)' },
    { Id: '5', value: '413311005 - Patient non-compliant - refused intervention / support (situation)' },
    { Id: '6', value: '413312003 - Patient non-compliant - refused service (situation)' },
    { Id: '7', value: '183932001 - Procedure contraindicated (situation)' },
    { Id: '8', value: '397745006 - Medical contraindication (finding)' },
    { Id: '9', value: '407563006 - Treatment not tolerated (situation)' },
    { Id: '10', value:'428119001 - Procedure not indicated (situation)' },
    { Id: '11', value:'59037007 - Drug intolerance' },
    { Id: '12', value:'62014003 - Adverse reaction to drug' }
  ];
  interventaionList:any=[];
  reasonFiltered:any=[];
  interventaionFilter:any=[];
  AddEditCQM : CQMNotPerformed;
  desciption:any = [];
  PatientDetails: any = [];

  constructor(private ref: EHROverlayRef,private cqmNotperformedService: CQMNotPerformedService,
    private authService:AuthenticationService,private router:Router) {
    this.AddEditCQM = {} as CQMNotPerformed;
  }

  ngOnInit(): void {
    this.PatientDetails = this.authService.viewModel.Patient;
    this.reasonFiltered = this.searchReason.slice();
    this.getInterventaionDetails();
  }

  getInterventaionDetails(){
    this.cqmNotperformedService.InterventaionDetails().subscribe(resp => {
      if (resp.IsSuccess) {
        this.interventaionList = resp.ListResult;
        this.interventaionFilter = this.interventaionList.slice();
        console.log(this.interventaionFilter);
      }
    });
  }

  getreasondescription(item){
    let resason = item.value;
    resason = resason.split(" - ");
    this.AddEditCQM.ReasonCode = resason[0];
    this.AddEditCQM.ReasonDescription = resason[1];
    console.log(resason);
  }

  addUpdateCQMNotPerformed(){
    this.desciption  = this.AddEditCQM.InterventionDescription;
    this.AddEditCQM.InterventionCode = this.desciption.Code;
    this.AddEditCQM.InterventionDescription = this.desciption.Description;
    this.AddEditCQM.PatientId=this.PatientDetails.PatientId,
    this.AddEditCQM.ProviderId=this.PatientDetails.ProviderId,
    this.cqmNotperformedService.AddUpdateCQMNotPerformed(this.AddEditCQM).subscribe(resp => {
      if (resp.IsSuccess) {
        this.router.navigate(['/provider/login']);
        this.ref.close(null);
      }
    });
  }

  cancel(){
    this.ref.close(null);
  }
}
