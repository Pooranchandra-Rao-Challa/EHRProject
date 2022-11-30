import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { InterceptorService } from "../_loader/interceptor.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { PaginatorDirective } from 'src/app/_directives/pagination.directive'

@NgModule({
  imports: [
    QuickAppProMaterialModule,
    //FullCalendarModule,
    ReactiveFormsModule,
    FileUploadModule,
    FormsModule,
  ],
  exports: [
    QuickAppProMaterialModule,
    FileUploadModule,
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
  ],
  declarations: [GroupByPipe, FilterPipe, SearchPipe, TimeMaskDirective,TeethPlacePipe,
    MouseOverHintDirective,SimplePaginationDirective,npiValidatorDirective,
    ssnValidatorDirective,NunberMaskDirective,AlphaDirective,
    PaginatorDirective,],
  providers : [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  entryComponents: []
})
export class SharedModule { }
