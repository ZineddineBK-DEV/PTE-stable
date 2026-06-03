import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxDropzoneModule } from 'ngx-dropzone';

// Shared between InternsRequestModule and SelectedInternModule
import { InternDocsComponent } from '../../interns-request/itern-docs/intern-docs.component';

@NgModule({
  declarations: [InternDocsComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forChild(),
    NgxDropzoneModule,
  ],
  exports: [InternDocsComponent],
})
export class InternDocsSharedModule {}
