import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxScrollbarModule } from 'ngx-scrollbar';

import { MyRequestsComponent } from '../../virtualisation-environment/my-requests/my-requests.component';
import { RequestApprovalModalComponent } from '../../virtualisation-environment/request-approval-modal/request-approval-modal.component';
import { LabDetailsComponent } from '../../virtualisation-environment/lab-details/lab-details.component';

const routes: Routes = [{ path: '', component: MyRequestsComponent }];

@NgModule({
  declarations: [MyRequestsComponent, RequestApprovalModalComponent, LabDetailsComponent],
  imports: [
    CommonModule, NgbModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(), NgxScrollbarModule,
  ],
  exports: [RouterModule],
})
export class MyRequestsModule {}
