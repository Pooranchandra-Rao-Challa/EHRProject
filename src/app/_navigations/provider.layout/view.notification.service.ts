import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { User, UserLocations } from 'src/app/_models';
import { PatientProfile } from 'src/app/_models/_patient/patientprofile';

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

