import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { DocsComponent } from '../../offers/selected-intern/docs/docs.component';

const routes: Routes = [{ path: '', component: DocsComponent }];

@NgModule({
  declarations: [DocsComponent],
  imports: [
    CommonModule, NgbModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(), NgxDropzoneModule,
  ],
  exports: [RouterModule],
})
export class InternDocsRouteModule {}
