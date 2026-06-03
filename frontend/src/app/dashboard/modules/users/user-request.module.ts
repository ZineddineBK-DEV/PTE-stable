import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { UserRequestComponent } from '../../user-request/user-request.component';

const routes: Routes = [{ path: '', component: UserRequestComponent }];

@NgModule({
  declarations: [UserRequestComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), NgxDatatableModule,
  ],
  exports: [RouterModule],
})
export class UserRequestModule {}
