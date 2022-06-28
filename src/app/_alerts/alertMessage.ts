import Swal from 'sweetalert2';

export class AlertMessage {

  constructor() { }

  displayMessageDailog(message) {
    Swal.fire({
      title: message,
      position: 'top',
      background: '#e1dddd',
      showConfirmButton: true,
      confirmButtonText: 'Close',
      width: '600',
      customClass: { container: 'swal2-container-high-zindex' }
    });
  }

  displayErrorDailog(message) {
    Swal.fire({
      title: message,
      position: 'top',
      showConfirmButton: true,
      confirmButtonText: 'Close',
      width: '600',
      customClass: { title: 'swal2-title-custom', container: 'swal2-container-high-zindex' }
    });
  }
  displaysubmitted(message) {
    Swal.fire({
      title: message,
      position: 'center',
      text: ERROR_CODES['I3PS001'],
      confirmButtonText: 'Done',
      confirmButtonColor: "#41b6a6",

    })
  }
  userCreateConfirm(code: string,provider: string){
    Swal.fire({
      title: ERROR_CODES['T2JP001'],
      position: 'top',
      background: '#e1dddd',
      showConfirmButton: true,
      html:
    'An email has been set to, ' +
    '<p>' +provider+
    '<p> He/She wil need to enter the Practice record ID# to activate their account.'+
    '<p>  Practice Record ID# <b>'+code+'</b>',
      confirmButtonText: 'Done',
      confirmButtonColor: "#41b6a6",
      customClass: { container: 'swal2-container-high-zindex',
      actions:'user-swal2-actions',
      title:'user-swal2-actions' }

    })

  }
}
/**
 * Please add here more screens info when developer finds new.
 *
 */

/**
 * MessageTYps: Message: M Error: E Waring: W,I: Info,Titles: T
 * ---------------------------------------------
 * Modlues; Admin : 1 , Provider: 2 , Patient : 3
 * ----------------------------------------------
 * Screens; Proverder login
 * SmartScheduler: A
 * Calender: B
 * Patients: C
 * Messages: D
 * DirectMsg: E
 * Erx: F
 * LabgImage: G
 * Report: H
 * Billing: I
 * Settings: J
 * Screens: Adming Lofin
 * Provider:P
 * partnersignup :PS,
 * WeeklyUpated:WP
 * -------------------------------------
 * If the screens has more funcitonal items then
 * Like in settings use frist letter as code, if same
 * code is comming more times then use two letters
 * If two words use to letters
 *
 * SETTINGS
 * Practice : P
 * Schedule : S
 * Erx.  : E
 * Patinet Educations: PE
 * Clinic Decision Support : CDS
 * Audit Log : AL
 *
 * PATIENTS
 * Chart : C
 * Dental Chart : DC
 * Profile : P
 * Insurance : I
 * Amendments : A
 * Patients : PA
 * CQMsNotPerformed : CNP
 *
 * Details of Patients
 * AddProcedure: P1
 *
 * SMART SCHEDULER
 * Appointments: A
 * Encoutners: E
 * Patinet: P
 * ----------------------------------------
 * These are some dialogs in Chart screen
 *
 * CHART
 * Diagnoses : D
 * Smoking Status : SS
 * Tobacco Use : TU
 * Past Medical Histories : PMH
 * Advanced Directives : AD
 * Allergies : A
 * Medications And Prescription : MAP
 * Immunizations : I
 * Screenings/Interventions/Assessments : SIA
 * Encounters : E
 * Messages : M
 * Appointments : AP
 * ---------------------------------------------------
 * Errors Number shouw be three digits like 001
 *
 * Example if Messages for Setting screen of providers the Message like M2J001
 * On any change in the above counter should be initialized.
 */
export const ERROR_CODES: { [key: string]: string } = {
  // Message form Setting screen
  'M2JP001': 'Location updated successfully',
  'M2JP002': 'Location added successfully',
  'M2JP003': 'Location deleted successfully',
  'M2JP005': 'User Updated successfully',
  'M2JP007': 'User Added successfully',
  'M2JP008': 'Timezone updated successfully',
  'M2JP009': 'Password updated successfully',

  // Error block setting
  'E2JP001': 'Location Updation error',
  'E2JP002': 'Error while validating address',
  'E2JP003': 'User updation error',
  'E2JP004': 'Timezone updation error',
  'E2JP005': 'Location delation error.',
  'E2JP006': 'Location delation error.',
  'E2JP007': 'User add error.',
  'E2JP008': 'Password updation error.',

  //Message for provider setting schedule..
  'M2JS001': 'Timezone updated successfully',

  //Message for Advanced Directives in chart screen
  'M2CAD001': 'Advanced Directives added successfully',
  'M2CAD002': 'Advanced Directives updated successfully',
  'M2CAD003': 'Advanced Directives deleted successfully',

  // Error for Advanced directives
  'E2CAD001': 'Advanced Directives Updation error',

  // Message form Patient profile screen
  'M2CP001': 'Personal Information updated successfully',
  'M2CP002': 'Contact Information updated successfully',
  'M2CP003': 'Emergency Contact updated successfully',
  'M2CP004': 'Relationship updated successfully',
  'M2CP005': 'Demographics updated successfully',
  'M2CP006': 'Next of kin updated successfully',
  'M2CP007': 'Immunization registry updated successfully',

  // Error for Patient profile directives
  'E2CP001': 'Personal Information Updation error',
  '2CP002' : 'Contact Information Updation error',
  'E2CP003': 'Emergency Contact Updation error',
  'E2CP004': 'Relationship Updation error',
  'E2CP005': 'Demographics Updation error',
  'E2CP006': 'Next of kin Updation error',
  'E2CP007': 'Immunization Updation error',
  //Message for Partner signup
  'M3PS001': 'Application Submitted!',

  //Error for Partner signup
  'E3PS001': 'Partner Error',
  'I3PS001': 'Thank you for your interest in becoming a partner application. Our team will be reaching out to you in the next 3-5 business days',
  //Message for Smoking Status in chart screen
  'M2CSS001': 'Smoking Status added successfully',
  'M2CSS002': 'Smoking Status updated successfully',
  'M2CSS003': 'Smoking Status deleted successfully',

  // Error for Smoking Status
  'E2CSS001': 'Smoking Status Updation error',

  // Message for Admin Provider  Status
  'M1P001': 'Your 30-Day Trial version is finished',
  // Message for Insurance
  'M2CI001': 'Insurance Company Plan created successfully',
  'M2CI002': 'Insurance Company Plan Updated successfully',
  'M2CI003': 'Insurance Company Plan  deleted successfully',
  'M2CI004': 'Primary Insurance Added successfully',
  'M2CI005': 'Primary Insurance Updated successfully',
  'M2CI006': 'Secondary Insurance Added successfully',
  'M2CI007': 'Secondary Insurance Updated successfully',


  //Error for Insurance
  'E2CI001': 'Insurance Company Plan  Updation error',
  'E2CI002': 'Primary Insurance Updation error',
  'E2CI003': 'Secondary Insurance Updation error',

  //Messages for Patients Procedure Crete
  'M2CP1001': 'Procedure Added sucessfully',
  'M2CP1002': 'Procedure Updated sucessfully',

  //ERRORs for Patients Procedure Crete
  'E2CP1001': 'Procedure Updated sucessfully',

  // Smart Scheduler Apoointments;
  'M2AA001': 'Appointment Added successfully',
  'M2AA002': 'Appointment Updated successfully',
  'M2AA003': 'Appointment Deleted successfully',

  'E2AA001': 'Appointment Add error',
  'E2AA002': 'Appointment Update error',
  'E2AA003': 'Appointment Deleted error',


  // Smart Schedulerl Encounters;
  'M2AE001': 'Encounter Added successfully',
  'M2AE002': 'Encounter Updated successfully',

  'E2AE001': 'Encounter Adding error',
  'E2AE002': 'Encounter Update error',
  'E2AE003': 'Encounter Data Read  error',

  //Error for WeeklyUpated
  'E1WU001': 'Please insert the data into the fields',

  'T2JP001' : 'User has been added!',
  'M2AP001' : 'Patient Added successfully',
  'M2AP002' : 'Patient Invitaion pdf downloaded',
  'M2AP003' : 'Patient Invitaion mail sent',
  'E2AP001' : 'Patient Adding error',

   // CQM Not performed
  'M2CCNP001': 'Not Performed Reason created successfully',
  'M2CCNP002': 'Not Performed Reason updated successfully',

  // Error for CQM Not performed
  'E2CCNP001': 'Not Performed Reason created error',

  'E2AP002' : 'Patient User account create error',
};


