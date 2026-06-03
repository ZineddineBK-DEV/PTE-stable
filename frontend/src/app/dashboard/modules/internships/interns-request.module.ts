import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { InternsRequestComponent } from '../../interns-request/interns-request.component';
import { AddInternModalComponent } from '../../interns-request/add-intern-modal/add-intern-modal.component';
import { InternDocsSharedModule } from '../shared/intern-docs-shared.module';

const routes: Routes = [{ path: '', component: InternsRequestComponent }];

@NgModule({
  declarations: [InternsRequestComponent, AddInternModalComponent],
  imports: [
    CommonModule, NgbModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(),
    NgxDatatableModule, NgxDropzoneModule, InternDocsSharedModule,
  ],
  exports: [RouterModule],
})
export class InternsRequestModule {}
