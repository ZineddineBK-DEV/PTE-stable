import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { UserRequestComponent } from '../../user-request/user-request.component';

const routes: Routes = [{ path: '', component: UserRequestComponent }];

@NgModule({
  declarations: [UserRequestComponent],
  imports: [
    CommonModule, NgbModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(), NgxDatatableModule,
  ],
  exports: [RouterModule],
})
export class UserRequestModule {}
