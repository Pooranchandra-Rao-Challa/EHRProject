import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../overlay.service';
import { PatientDialogComponent } from '../../dialogs/patient.dialog.component';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  patientColumns: string[] = ['Image', 'First', 'Middle', 'Last', 'DOB', 'Age', 'ContactInfo', 'LastAccessed', 'Created', 'Select'];
  patientsDataSource: any;
  filteredPatients: any;
  searchName: any;
  patientDialogComponent = PatientDialogComponent;
  dialogResponse = null;

  constructor(public overlayService: OverlayService) { }

  ngOnInit(): void {
    this.patientsDataSource = [
      { First: 'Sai', Middle: 'Karthik', Last: 'T', DOB: 'Mar 24, 2022', Gender: 'male', Age: '25', ContactInfo: 'H: (534) 645-6547C: (456) 565-4675', Mail: 'karthik@gmail.com', LastAccessed: '03/30/2022 01:36 am', Created: '03/30/2022 01:36 am', Select: true },
      { First: 'Vamsi', Middle: '', Last: 'A', DOB: 'Mar 24, 2022', Gender: 'male', Age: '25', ContactInfo: 'H: (534) 645-6547C: (456) 565-4675', Mail: 'sandeep@gmail.com', LastAccessed: '03/30/2022 01:36 am', Created: '03/30/2022 01:36 am', Select: false }
    ]
  }

  showInactive(event) {
    this.patientsDataSource = [];
  }

  toggleSelect(event) {
    if (event.checked == true) {
      this.patientsDataSource = [];
    }
    else {
      this.ngOnInit();
    }
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {
        //} else if (content === this.yesNoComponent) {
        //this.yesNoComponentResponse = res.data;
      }
      else if (content === this.patientDialogComponent) {
        this.dialogResponse = res.data;
      }
    });
  }

  filtered() {
    this.filteredPatients = this.patientsDataSource.filter(a => a.First === this.searchName);
    this.patientsDataSource = this.filteredPatients;
  }
}
