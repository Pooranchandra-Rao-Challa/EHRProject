import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  nameTitle: { titleId: number; titleName: string; }[];
  credentials: { credId: number; credName: string; }[];
  speciality: { specId: number; specName: string; }[];
  showpersonalInfoReq: boolean = true;
  showcontactInfoReq: boolean = false;
  showaccountInfoReq: boolean = false;

  constructor() { }

  ngOnInit(): void {
    debugger
    this.dropdownMenusList();
    $(document).ready(function () {
      // Step1
      $("button.next-step1").click(function () {
        document.getElementById('contactinfo-tab').classList.remove('disabled');
        document.getElementById('contactinfo-tab').click();
        $(".item:not(.active)").addClass("disabled");
      });
      // Step2
      $("button.next-step2").click(function () {
        document.getElementById('additionalinfo-tab').classList.remove('disabled');
        document.getElementById('additionalinfo-tab').click();
        $(".item:not(.active)").addClass("disabled");
      });
      $("button.prev-step2").click(function () {
        document.getElementById('personalInfo-tab').classList.remove('disabled');
        document.getElementById('personalInfo-tab').click();
        $(".item:not(.active)").addClass("disabled");
      });
      // Step3
      $("button.next-step3").click(function () {
        document.getElementById('signup-additionalinfo-tab').classList.remove('disabled');
        document.getElementById('signup-additionalinfo-tab').click();
        $(".item:not(.active)").addClass("disabled");
      });
      $("button.prev-step3").click(function () {
        document.getElementById('contactinfo-tab').classList.remove('disabled');
        document.getElementById('contactinfo-tab').click();
        $(".item:not(.active)").addClass("disabled");
      });
      // Step4
      $("button.prev-step4").click(function () {
        document.getElementById('additionalinfo-tab').classList.remove('disabled');
        document.getElementById('additionalinfo-tab').click();
        $(".item:not(.active)").addClass("disabled");
      });

      $('.category-buttons .item').on('shown.bs.tab', function (event) {
        // var x = $(event.target);         // active tab
        //  var y = $(event.relatedTarget);  // previous tab
        $(event.relatedTarget).addClass('done');
      });
    });
  }

  dropdownMenusList() {
    this.nameTitle = [
      { titleId: 1, titleName: 'Dr' },
      { titleId: 2, titleName: 'Mr' },
      { titleId: 3, titleName: 'Ms' },
      { titleId: 4, titleName: 'Mrs' },
    ];
    this.credentials = [
      { credId: 1, credName: 'DDS' },
      { credId: 2, credName: 'DMD' },
      { credId: 3, credName: 'MD' },
      { credId: 4, credName: 'DO' },
      { credId: 5, credName: 'RDH' },
      { credId: 6, credName: 'N/A Degree' },
    ];
    this.speciality = [
      { specId: 1, specName: 'Dentistry' },
      { specId: 2, specName: 'Endodontics' },
      { specId: 3, specName: 'Oral and maxillofacial Pathology' },
      { specId: 4, specName: 'Oral and Maxillofacial Radiology' },
      { specId: 5, specName: 'Oral and Maxillofacial Surgery' },
      { specId: 6, specName: 'Orthodontics and Dentofacial Orthopedics' },
      { specId: 7, specName: 'Pediatric Dentistry' },
      { specId: 8, specName: 'Periodontics' },
      { specId: 9, specName: 'Prosthodontics' },
      { specId: 10, specName: 'N/A speciality' },
    ];
  }

  personalInfoReq() {
    debugger
    this.showpersonalInfoReq = false;
    this.showcontactInfoReq = true;
  }

  contactInfoReq(event) {
    debugger
    if (event == 'prev') {
      this.showpersonalInfoReq = true;
      this.showcontactInfoReq = false;
    }
    else {
      this.showcontactInfoReq = false;
      this.showaccountInfoReq = true;
    }
  }

  accountInfoReq(event) {
    debugger
    if (event == 'prev') {
      this.showcontactInfoReq = true;
      this.showaccountInfoReq = false;
    }
    else {

    }
  }

  alertWithSuccess() {
    // Swal.fire('Any fool can use a computer')
    Swal.fire({
      title: 'Thank you for registering for an EHR1 Account! An email with instructions for how to complete setup of your account has been sent to spooorthy@calibrage.in',
      showConfirmButton: true,
      confirmButtonText: 'Close',
      padding: '0em',
    })
  }

}
