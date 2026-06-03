import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SelectedInternComponent } from '../../offers/selected-intern/selected-intern.component';
import { InternDocsSharedModule } from '../shared/intern-docs-shared.module';

const routes: Routes = [{ path: '', component: SelectedInternComponent }];

@NgModule({
  declarations: [SelectedInternComponent],
  imports: [
    CommonModule, NgbModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(),
    NgxDatatableModule, InternDocsSharedModule,
  ],
  exports: [RouterModule],
})
export class SelectedInternModule {}
