import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { FamilyMedicalHistory, User, UserLocations } from 'src/app/_models';
import { PatientProfile } from 'src/app/_models/_patient/patientprofile';
import { PatientBreadcurm } from 'src/app/_models/_provider/Providerpatient';

@Injectable()
export class LocationSelectService {
  private subject = new Subject<any>();

  sendData(message: string) {
    this.subject.next(message);
  }

  clearData() {
    this.subject.next();
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }
}

@Injectable()
export class ViewChangeService {
  private subject = new Subject<any>();

  sendData(view: string) {
    this.subject.next(view);
  }

  clearData() {
    this.subject.next();
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }
}



@Injectable()
export class PatientUpdateService {
  private subject = new Subject<PatientProfile>();

  sendData(view: PatientProfile) {
    this.subject.next(view);
  }

  clearData() {
    this.subject.next();
  }

  getData(): Observable<PatientProfile> {
    return this.subject.asObservable();
  }
}

@Injectable()
export class RecordsChangeService {
  private subject = new Subject<any>();

  sendData(view: string) {
    this.subject.next(view);
  }

  clearData() {
    this.subject.next();
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }
}

export class MessageCounts {
  UnreadCount: number;
  UrgentCount: number;
}

@Injectable()
export class NotifyMessageService {
  private subject = new Subject<any>();

  sendData(counts: MessageCounts) {
    this.subject.next(counts);
  }

  clearData() {
    this.subject.next();
  }

  getData(): Observable<MessageCounts> {
    return this.subject.asObservable();
  }
}


export class ProviderHeader {
  FirstName: string;
  LastName: string;
}

@Injectable()
export class NotifyProviderHeaderService {
  private subject = new Subject<any>();

  sendData(provider: ProviderHeader) {
    this.subject.next(provider);
  }

  clearData() {
    this.subject.next();
  }

  getData(): Observable<ProviderHeader> {
    return this.subject.asObservable();
  }
}

@Injectable()
export class ProviderLocationUpdateNotifier {
  private subject = new Subject<any>();

  sendData(updateLocations: boolean) {
    this.subject.next(updateLocations);
  }

  clearData() {
    this.subject.next();
  }

  getData(): Observable<boolean> {
    return this.subject.asObservable();
  }
}

@Injectable()
export class UpdateEmergencyAccess {
  private subject = new Subject<any>();

  sendData(updateAccess: boolean) {
    this.subject.next(updateAccess);
  }

  clearData() {
    this.subject.next();
  }

  getData(): Observable<boolean> {
    return this.subject.asObservable();
  }
}

@Injectable()
export class DrfirstUrlChanged {
  private subject = new Subject<{ urlfor: string,purpose:string, url: string }>();

  sendData(url: string, urlfor: string,purpose:string='report') {
    this.subject.next({ url: url,purpose, urlfor: urlfor });
  }

  clearData() {
    this.subject.next();
  }

  getData(): Observable<{ urlfor: string,purpose:string, url: string }> {
    return this.subject.asObservable();
  }
}


@Injectable()
export class FamilyRecordNotifier {
  private subject = new Subject<{ record: FamilyMedicalHistory,isdeleted: boolean }>();

  sendData(data: FamilyMedicalHistory,action: boolean ) {
    this.subject.next({ record: data, isdeleted: action });
  }

  clearData() {
    this.subject.next();
  }

  getData(): Observable<{ record: FamilyMedicalHistory,isdeleted: boolean }> {
    return this.subject.asObservable();
  }
}


@Injectable()
export class NotifyPatientChangedInProviderPatientDetails {
  private subject = new Subject<{ breadcrumb: PatientBreadcurm,showListView: boolean }>();

  sendData(breadcrumb: PatientBreadcurm,showListView: boolean ) {
    this.subject.next({ breadcrumb: breadcrumb, showListView: showListView });
  }

  clearData() {
    this.subject.next();
  }

  getData(): Observable<{ breadcrumb: PatientBreadcurm,showListView: boolean }> {
    return this.subject.asObservable();
  }
}
