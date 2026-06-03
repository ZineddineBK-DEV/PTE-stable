import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgApexchartsModule } from 'ng-apexcharts';

import { UserListComponent } from '../../user-list/user-list.component';
import { UserDetailsComponent } from '../../user-list/user-details/user-details.component';

const routes: Routes = [{ path: '', component: UserListComponent }];

@NgModule({
  declarations: [UserListComponent, UserDetailsComponent],
  imports: [
    CommonModule, NgbModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(),
    NgxDatatableModule, NgApexchartsModule,
  ],
  exports: [RouterModule],
})
export class UserListModule {}
