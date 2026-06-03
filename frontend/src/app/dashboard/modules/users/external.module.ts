import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxScrollbarModule } from 'ngx-scrollbar';

import { ExternalUserComponent } from '../../external-user/external-user.component';
import { AddExternalModalComponent } from '../../external-user/add-external-modal/add-external-modal.component';
import { PreviewDocsModalComponent } from '../../external-user/preview-docs-modal/preview-docs-modal.component';

const routes: Routes = [{ path: '', component: ExternalUserComponent }];

@NgModule({
  declarations: [ExternalUserComponent, AddExternalModalComponent, PreviewDocsModalComponent],
  imports: [
    CommonModule, NgbModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(),
    NgxDatatableModule, NgxDropzoneModule, NgxScrollbarModule,
  ],
  exports: [RouterModule],
})
export class ExternalModule {}
