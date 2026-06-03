/**
 * Shared modules for cross-cutting modal components that are opened
 * by NgbModal from multiple routed pages.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

// Profile components shared between ProfileModule and UserProfileModule
import { DownloadCVComponent } from '../../profile/download-cv/download-cv.component';
import { ShowSigComponent } from '../../profile/show-sig/show-sig.component';

@NgModule({
  declarations: [DownloadCVComponent, ShowSigComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forChild(),
  ],
  exports: [DownloadCVComponent, ShowSigComponent],
})
export class ProfileSharedModule {}
