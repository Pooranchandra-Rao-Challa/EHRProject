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
      customClass: {
        container: 'swal2-container-high-zindex',
        confirmButton: 'swal2-messaage'
      }
    });
  }

  displayErrorDailog(message) {
    Swal.fire({
      title: message,
      position: 'top',
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Close',
      //cancelButtonColor: '#d74842',
      width: '500',
      customClass: {
        title: 'swal2-title-error', container: 'swal2-container-high-zindex',
        cancelButton: 'swal2-error'
      }
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
  userCreateConfirm(code: string, provider: string) {
    Swal.fire({
      title: ERROR_CODES['T2JP001'],
      position: 'top',
      background: '#e1dddd',
      showConfirmButton: true,
      html:
        'An email has been set to, ' +
        '<p>' + provider +
        '<p> He/She wil need to enter the Practice record ID# to activate their account.' +
        '<p>  Practice Record ID# <b>' + code + '</b>',
      confirmButtonText: 'Done',
      confirmButtonColor: "#41b6a6",
      customClass: {
        container: 'swal2-container-high-zindex',
        actions: 'user-swal2-actions',
        title: 'user-swal2-actions'
      }

    })

  }

}
/**
 * Please add here more screens info when developer finds new.
 *
 */

/**
 * MessageTYps: Message: M Error: E Waring: W,I: Info,Titles: T
 * ----------------------------------------------
 *
 * ----------------------------------------------
 * Login forms; L
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
 * Family health histories : FHH
 * Advanced Directives : AD
 * Allergies : A
 * Medications And Prescription : M
 * Immunizations : I
 * Screenings/Interventions/Assessments : SIA
 * Encounters : E
 * Messages : M
 * Appointments : AP
 *
 * Schedule
 * Rooms : R
 * Appointment Type : AT
 * Appointment Status : AS
 *
 * LabsAndImaging
 * Order: 1
 * Results: 2
 *
 * CalendarModule
 * Blockout: 1
 * --------------------------------------------------
 * Patient Module
 *
 * Appoinments : A
 * Messages : M
 * DashBoard: D
 * MyProfile
 *
 * ----------------------------------------------------
 * Admin Module
 *
 * Admins : A
 * Default Messages : DM
 *
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
  'E2JP009': 'Verification Failed- Address not verified, please try again!',

  //Message for provider setting schedule..
  'M2JS001': 'Timezone updated successfully',

  //Message for Advanced Directives in chart screen
  'M2CAD001': 'Advanced Directive added successfully',
  'M2CAD002': 'Advanced Directive updated successfully',
  'M2CAD003': 'Advanced Directive deleted successfully',

  // Error for Advanced directives
  'E2CAD001': 'Advanced Directive Updation error',

  //Message for past medical histories in chart screen
  'M2CPMH001': 'Past medical history added successfully',
  'M2CPMH002': 'Past medical history updated successfully',
  'M2CPMH003': 'Past medical history deleted successfully',

  // Error for past medical histories
  'E2CPMH001': 'Past medical history Updation error',

  //Message for family health histories in chart screen
  'M2CFHH001': 'Family health history added successfully',
  'M2CFHH002': 'Family health history updated successfully',
  'M2CFHH003': 'Family health history deleted successfully',

  // Error for family health histories
  'E2CFHH001': 'Family health history Updation error',

  // Message form Patient profile screen
  'M2CP001': 'Personal Information updated successfully',
  'M2CP002': 'Contact Information updated successfully',
  'M2CP003': 'Emergency Contact updated successfully',
  'M2CP004': 'Relationship updated successfully',
  'M2CP005': 'Demographics updated successfully',
  'M2CP006': 'Next of kin updated successfully',
  'M2CP007': 'Immunization registry updated successfully',
  'M2CP008': 'Patient updated successfully',

  //Security Question
  'M2CP009':  'Security question is updated successfully ',
  'M2CP0010': 'Address verification',
  'M2CP0011': 'Authorized representative added sucessfully',
  'M2CP0012': 'Authorized representative updated sucessfully',

  // Error for Patient profile directives
  'E2CP001': 'Personal Information Updation error',
  'E2CP002': 'Contact Information Updation error',
  'E2CP003': 'Emergency Contact Updation error',
  'E2CP004': 'Relationship Updation error',
  'E2CP005': 'Demographics Updation error',
  'E2CP006': 'Next of kin Updation error',
  'E2CP007': 'Immunization Updation error',
  'E2CP008': 'Security Question Updation Error',
  'E2CP009': 'Address Verification Failed',
  'E2CP0010': 'Authorized representative failed',
  //Message for Partner signup
  'M3PS001': 'Application Submitted!',

  //Error for Partner signup
  'E3PS001': 'Partner Error',
  'I3PS001': 'Thank you for your interest in becoming a partner application. Our team will be reaching out to you in the next 3-5 business days',
  //Message for Smoking status in chart screen
  'M2CSS001': 'Smoking status added successfully',
  'M2CSS002': 'Smoking status updated successfully',
  'M2CSS003': 'Smoking status deleted successfully',

  // Error for Smoking Status
  'E2CSS001': 'Smoking status Updation error',

  //Message for tobacco use in chart screen
  'M2CTU001': 'Tobacco use added successfully',
  'M2CTU002': 'Tobacco use updated successfully',
  'M2CTU003': 'Tobacco use deleted successfully',

  // Error for Smoking Status
  'E2CTU001': 'Tobacco use Updation error',

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
  'M2CI008': 'Primary Insurance Address Verified successfully',
  'M2CI009': 'Secondary Insurance Address Verified successfully',


  //Error for Insurance
  'E2CI001': 'Insurance Company Plan  Updation error',
  'E2CI002': 'Primary Insurance Updation error',
  'E2CI003': 'Secondary Insurance Updation error',
  'E2CI004': 'Primary Insurance  Address Verification Failed',
  'E2CI005': 'Secondary Insurance Address Verification Failed',

  //Messages for Patients Procedure Crete
  'M2CP1001': 'Procedure Added successfully',
  'M2CP1002': 'Procedure Updated successfully',
  'M2CP1003': 'Procedure Deleted successfully',

  //ERRORs for Patients Procedure Crete
  'E2CP1001': 'Procedure Updated error',
  'E2CP1002': 'Procedure Deletion error',

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

  'T2JP001': 'User has been added!',
  'M2AP001': 'Patient Added successsfully',
  'E2AP001': 'Patient Adding error',
  'E2AP002': 'Patient User account create error',
  'M2AP002': 'Patient Invitaion pdf downloaded',
  'M2AP003': 'Patient Invitaion mail sent',

  //Message for allergies in chart screen
  'M2CA001': 'Allergy added successfully',
  'M2CA002': 'Allergy updated successfully',
  'M2CA003': 'Allergy deleted successfully',

  // Error for allergies
  'E2CA001': 'Allergy Updation error',

  //Message for diagnoses in chart screen
  'M2CD001': 'Diagnoses added successfully',
  'M2CD002': 'Diagnoses updated successfully',
  'M2CD003': 'Diagnoses deleted successfully',

  // Error for diagnoses
  'E2CD001': 'Diagnoses Updation error',
  'E2CD002': 'Diagnoses deleted error',

  //Message for medication in chart screen
  'M2CM001': 'Medication added successfully',
  'M2CM002': 'Medication updated successfully',
  'M2CM003': 'Medication deleted successfully',

  // Error for medication
  'E2CM001': 'Medication Updation error',

  //Message for immunization in chart screen
  'M2CCI001': 'Immunization added successfully',
  'M2CCI002': 'Immunization updated successfully',
  'M2CCI003': 'Immunization deleted successfully',

  // Error for immunization
  'E2CCI001': 'Immunization Updation error',

  //Message for interventions in chart screen
  'M2CCSIA001': 'Intervention added successfully',
  'M2CCSIA002': 'Intervention updated successfully',
  'M2CCSIA003': 'Intervention deleted successfully',

  // Error for Smoking Status
  'E2CCSIA001': 'Intervention Updation error',

  // CQM Not performed
  'M2CCNP001': 'Not Performed Reason created successfully',
  'M2CCNP002': 'Not Performed Reason updated successfully',

  // Error for CQM Not performed
  'E2CCNP001': 'Not Performed Reason created error',

  // Schedule - Rooms
  'M2JSR001': 'Room added successfully',
  'M2JSR002': 'Room updated successfully',
  'M2JSR003': 'Room deleted successfully',

  // Error for CQM Not performed
  'E2JSR001': 'Rooms created error',

  // Schedule - Appointment Types
  'M2JSAT001': 'Appointment type added successfully',
  'M2JSAT002': 'Appointment type updated successfully',
  'M2JSAT003': 'Appointment type deleted successfully',
  'M2JSAT004': 'Appointment status is updated successfully',

  // Error for Rooms
  'E2JSAT001': 'Appointment type created error',
  'E2JSAT002': 'Appointment status is not updated.',
  'E2JSAT003': 'Appointment status update error.',

  // Schedule - Appointment Status
  'M2JSAS001': 'Appointment status added successfully',
  'M2JSAS002': 'Appointment status updated successfully',
  'M2JSAS003': 'Appointment status deleted successfully',

  // Error for Rooms
  'E2JSAS001': 'Appointment status created error',

  //Amendements
  'M2A001': 'Amendments added successfully',
  'M2A002': 'Amendments updated successfully',
  'M2A003': 'Amendments deleted successfully',

  //Error for Amendements

  'E2A001': 'Amendments created error',
  'E2A002': 'Amendments deleted successfully',

  // Labs and Imageing Messags
  'M2G1001': 'Lab Order added successfully',
  'M2G1002': 'Lab Order updated successfully',
  'M2G1003': 'Lab Order deleted successfully',
  'M2G1004': 'Lab Result added successfully',
  'M2G1005': 'Lab Result updated successfully',
  'M2G1006': 'Image Result added successfully',
  'M2G1007': 'Image Result updated successfully',
  'M2G1008': 'Image Order added successfully',
  'M2G1009': 'Image Order updated successfully',

  //Errors
  'E2G1001': 'Lab Order is not added',
  'E2G1002': 'Lab Order is not updated',
  'E2G1003': 'Lab Order is not deleted',
  'E2G1004': 'Lab Result is not added',
  'E2G1005': 'Lab Result is not updated',
  'E2G1006': 'Image Result is not added',
  'E2G1007': 'Image Result is not updated',
  'E2G1008': 'Image Order is not added',
  'E2G1009': 'Image Order is not updated',

  //Login Errors
  'EL001': 'Wrong email or password',
  'EL002': 'Session is timeout',
  'EL003': 'You need to sign in or sign up before continuing.',
  'EL005': 'The login to provider account is failed.',
  'EL006': 'Email not verified, please click on the verification in your email or resend confirmation to continue.',

  //Education Material Message
  'M2JPE001': 'Education Material added successfully',
  'M2JPE002': 'Education Material updated successfully',
  //Education Material Error

  'E2JPE001': 'Education Material updation Error',

  //Calendar Events Messages
  'M2B001': 'Rescheduled the appointment successfully',
  'M2B002': 'Appointment is allocated to new resource successfully',


  //Calendar Errors
  'E2B001': 'The time is elapsed to reschedule an appointment.',
  'E2B002': 'An appointment is existing for the same time and resource',
  'E2B003': 'Appointment is not rescheduled',
  'E2B004': 'Appointment is not allocated',
  'E2B005': 'Creating appointment outside business hours, If acceptable click Confirm else Reject.',
  //Clinical Decision Support
  'M2JCDS001': 'Alert added successfully',
  'M2JCDS002': 'Alert updated successfully',
  //Trigger Added and Delete
  'M2JCDS003': 'Trigger added successfully',
  'M2JCDS004': 'Trigger deleted successfully ',
  //Error for CDS
  'E2JCDS001': 'Alert updation error',
  'E2JCDS002': 'Trigger updation error',
  'E2JCDS003': 'Trigger deletion error',
  //Messages for Patient Appoinments
  'M3A001': 'Appointments added successfully ',
  'M3A002': 'Appointments cancelled successfully',
  //Error Messages for Patient Appoinments
  'E3A001': "Appointments updation error",
  //Messages for provider messages
  'M2D001': "Secure Message sent successfully",
  'M2D002': "Message Deleted successfully",
  //Error Message for provider messages
  'E2D001': "Messages Updation Error",

  //Admin screen in admin module
  'M1A003': 'Admin deleted successfully',

  // Error for Admin
  'E1DM001': 'Admin deletion error',

  //Default messages in admin module
  'M1DM001': 'Default messages updated successfully',

  // Error for Default messages
  'E1A001': 'Default messages updation error',

  // Calendar Blockout messages
  'M2B1001': 'Blockout added successfully',
  'M2B1002': 'Blockout updated successfully',
  'M2B1003': 'Blockout deleted successfully',

  'E2B1001': 'Blockout adding error',
  'E2B1002': 'Blockout update error',
  'E2B1003': 'Blockout delete error',
};


