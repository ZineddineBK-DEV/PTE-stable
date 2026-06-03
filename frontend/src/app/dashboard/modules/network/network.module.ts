import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { NetworkRequestsComponent } from '../../network-requests/network-requests.component';

const routes: Routes = [{ path: '', component: NetworkRequestsComponent }];

@NgModule({
  declarations: [NetworkRequestsComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(),
  ],
  exports: [RouterModule],
})
export class NetworkModule {}
