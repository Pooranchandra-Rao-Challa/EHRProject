import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IInput } from "../file-upload.type";

@Injectable()
export class FileUploadQueueService {
  private inputValueSubject = new BehaviorSubject<IInput>(null);
  inputValue$ = this.inputValueSubject.asObservable();

  initialize(input: IInput) {
    this.inputValueSubject.next(input);
  }

  getInputValue() {
    return this.inputValueSubject.getValue();
  }
}
