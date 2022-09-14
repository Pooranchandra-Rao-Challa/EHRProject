import { NgModule } from "@angular/core";
import { BytesPipe } from "./pipes/bytes.pipe";
import { MatProgressBarModule, } from "@angular/material/progress-bar";
import { MatCardModule, } from "@angular/material/card";
import { MatButtonModule, } from "@angular/material/button";
import { MatIconModule, } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FileUploadQueueComponent } from "./components/file-upload-queue.component";
import { FileUploadComponent } from "./components/file-upload.component";
import { FileUploadInputForDirective } from "./directives/upload-input-for.directive";

@NgModule({
  declarations: [
    BytesPipe,
    FileUploadQueueComponent,
    FileUploadComponent,
    FileUploadInputForDirective,
  ],
  imports: [
    MatProgressBarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    CommonModule,
  ],
  exports: [
    BytesPipe,
    FileUploadQueueComponent,
    FileUploadComponent,
    FileUploadInputForDirective,
  ],
})
export class FileUploadModule { }
