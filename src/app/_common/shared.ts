import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { GroupByPipe } from "../_pipes/group-by.pipe";
import { FilterPipe } from "../_pipes/search-filter.pipe";
import { SearchPipe ,TeethPlacePipe} from '../_pipes/search-filter.pipe';
import { QuickAppProMaterialModule } from "./material";
import { TimeMaskDirective } from 'src/app/_directives/input.time.mask.directive'
import { MouseOverHintDirective } from 'src/app/_directives/mouseover.hint.directive'
import { SimplePaginationDirective } from 'src/app/_directives/simple.pagination.directive'
import { npiValidatorDirective } from 'src/app/_directives/npi.validator.directive'
import { ssnValidatorDirective } from 'src/app/_directives/ssn.validator.directive'
import { NunberMaskDirective } from 'src/app/_directives/number.mask.directive'
import { AlphaDirective } from "../_directives/alphaonly.directive";
import { FileUploadModule } from 'src/app/file.upload/file-upload.module'
import { MaxValueDirective,MinValueDirective} from 'src/app/_directives/min.max.validator.directive'
//import { InterceptorService } from "../_loader/interceptor.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { PaginatorDirective } from 'src/app/_directives/pagination.directive'
import { AttachmentPreviewComponent } from "src/app/_components/attachments/attachment.preview.component";
import { AttachmentNopreviewComponent } from 'src/app/_components/attachments/attachment.nopreview.component'
//import { QRCodeModule } from 'angularx-qrcode'
@NgModule({
  imports: [
    QuickAppProMaterialModule,
    CommonModule,
    //FullCalendarModule,
    ReactiveFormsModule,
    FileUploadModule,
    FormsModule,
   // QRCodeModule
  ],
  exports: [
    QuickAppProMaterialModule,
    FileUploadModule,
    //QRCodeModule,
    PaginatorDirective,
    GroupByPipe,
    FilterPipe,
    SearchPipe,
    TeethPlacePipe,
    TimeMaskDirective,
    SimplePaginationDirective,
    npiValidatorDirective,
    ssnValidatorDirective,
    MouseOverHintDirective,
    NunberMaskDirective,
    AlphaDirective,
    AttachmentPreviewComponent,
    AttachmentNopreviewComponent,
  ],
  declarations: [GroupByPipe, FilterPipe, SearchPipe, TimeMaskDirective,TeethPlacePipe,
    MouseOverHintDirective,SimplePaginationDirective,npiValidatorDirective,
    ssnValidatorDirective,NunberMaskDirective,AlphaDirective,MaxValueDirective,MinValueDirective,
    PaginatorDirective,AttachmentPreviewComponent,AttachmentNopreviewComponent,],
  // providers : [
  //   { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  // ],
  entryComponents: []
})
export class SharedModule { }
