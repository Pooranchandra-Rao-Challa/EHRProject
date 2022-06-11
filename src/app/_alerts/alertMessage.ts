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
      customClass: {container:'swal2-container-high-zindex'}
    });
  }

  displayErrorDailog(message) {
    Swal.fire({
      title: message,
      position: 'top',
      showConfirmButton: true,
      confirmButtonText: 'Close',
      width: '600',
      customClass: {title: 'swal2-title-custom',container:'swal2-container-high-zindex'}
    });
  }
}
/**
 * Please add here more screens info when developer finds new.
 *
 */

/**
 * MessageTYps: Message: M Error: E Waring: W
 * ---------------------------------------------
 * Modlues; Admin : 1 , Provider: 2 , Patient : 3
 * ----------------------------------------------
 * Screens; Proverder login
 * SmartScheduler: A
 * Calender: B
 * Patinets: C
 * Messages: D
 * DirectMsg: E
 * Erx: F
 * LabgImage: G
 * Report: H
 * Billing: I
 * Settings: J
 * Screens: Adming Lofin
 *
 * -------------------------------------
 * If the screens has more funcitonal items then
 * Like in settings use frist letter as code, if same
 * code is comming more times then use two letters
 * If two words use to letters
 *
 * SETTINGS
 * Practice : P
 * Schedules : S
 * Erx.  : E
 * Patinet Educations: PE
 *
 * ---------------------------------------------------
 * Errors Number shouw be three digits like 001
 *
 * Example if Messages for Setting screen of providers the Message like M2J001
 * On any change in the above counter should be initialized.
 */
export const ERROR_CODES: {[key: string]:string} = {
  // Message form Setting screen
  'M2JP001': 'Location updated successfully',
  'M2JP002': 'Location added successfully',
  'M2JP003': 'Location deleted successfully',
  'M2JP005': 'User Updated successfully',
  'M2JP007': 'User Added successfully',
  'M2JP008': 'Timezone updated successfully',

  // Error block setting
  'E2JP001': 'Location Updation error',
  'E2JP002': 'Error while validating address',
  'E2JP003': 'User updation error',
  'E2JP004': 'Timezone updation error',
  'E2JP005': 'Location delation error.',
  'E2JP006': 'Location delation error.',

  //Message for provider setting schedule..
  'M2JS001': 'Timezone updated successfully'

};
