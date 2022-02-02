import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.csv';

@Injectable({
  providedIn: 'root'
})
export class TableUtil {

  constructor() { }
  public exportAsExcelFilePatient(json: any[], excelFileName: string): void {

    let Heading = [['Id','DOB','Patient Id','Patient Name','Date of Birth','Age','Cell Phone','Home phone','Work Phone','Email Address','Gender','Address','City','State','Zip','Prime Subscriber Id','Prime Subscriber Name'
  ]];
    const wb1 = XLSX.utils.book_new();
    const ws1: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws1, Heading);
    XLSX.utils.sheet_add_json(ws1, json, { origin: 'A2', skipHeader: true });
    //ws.delete_cols(6, 3)
    ws1['!cols'] = [
      {
        "hidden": true
      },
     null,
     null,
     null,
     {
      "hidden": true
    },
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,null,null,null
    ];
    const myworkbook: XLSX.WorkBook = { Sheets: { 'Patient-Report': ws1 }, SheetNames: ['Patient-Report'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  public exportAsExcelFileEncounter(json: any[], excelFileName: string): void {
  
    let Heading = [['Id','Birth Date','Encounter Date','Encounter Id','Patient Name','Provider Name','Birth Date',' Age','Encounter Date','Proc Code','Description','Proc Fees','Prime Subscriber Id','Prime Ins Company Name','Prime Source of Payment Typology'
  ]];
    const wb1 = XLSX.utils.book_new();
    const ws1: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws1, Heading);
    XLSX.utils.sheet_add_json(ws1, json, { origin: 'A2', skipHeader: true });
    //ws.delete_cols(6, 3)
    ws1['!cols'] = [
      {
        "hidden": true
      },
     null,
      {
        "hidden": true
      },
     null,
      null,
      null,
      null,
      {
        "hidden": true
      },
      null,
      null,
      null,
      null,
      null,
      null
    ];
    const myworkbook: XLSX.WorkBook = { Sheets: { 'Encounter-Report': ws1 }, SheetNames: ['Encounter-Report'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  public exportAsExcelFileProblem(json: any[], excelFileName: string): void {

    let Heading = [['Id','Patient Name','Sex','DOB','Address1','Address2','City','State','Zip Code',' Last Encounter','Active','Dx ICD10/SNOMED Code','Dx ICD10/SNOMED Description','Dx Start Date','Dx End Date','Smoking Status','Allergy'
  ]];
    const wb1 = XLSX.utils.book_new();
    const ws1: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws1, Heading);
    XLSX.utils.sheet_add_json(ws1, json, { origin: 'A2', skipHeader: true });
    //ws.delete_cols(6, 3)
    ws1['!cols'] = [
      {
        "hidden": true
      },
      null,
     null,
     null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,null,null,null
    ];
    const myworkbook: XLSX.WorkBook = { Sheets: { 'Problem-Report': ws1 }, SheetNames: ['Problem-Report'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '-Report'+ EXCEL_EXTENSION);
  }
}
