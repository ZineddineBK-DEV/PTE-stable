import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { MyLeaveRequestsComponent } from '../../leave/my-leave-requests/my-leave-requests.component';
import { LeaveDocComponent } from '../../leave/leave-doc/leave-doc.component';

const routes: Routes = [{ path: '', component: MyLeaveRequestsComponent }];

@NgModule({
  declarations: [MyLeaveRequestsComponent, LeaveDocComponent],
  imports: [
    CommonModule, NgbModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(),
  ],
  exports: [RouterModule],
})
export class MyLeaveModule {}
