import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { LeaveComponent } from '../../leave/leave.component';

const routes: Routes = [{ path: '', component: LeaveComponent }];

@NgModule({
  declarations: [LeaveComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(), NgxDropzoneModule,
  ],
  exports: [RouterModule],
})
export class LeaveModule {}
