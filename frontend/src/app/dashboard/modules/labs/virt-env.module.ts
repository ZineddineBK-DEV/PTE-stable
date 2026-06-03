import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { MatStepperModule } from '@angular/material/stepper';

import { VirtualisationEnvironmentComponent } from '../../virtualisation-environment/virtualisation-environment.component';

const routes: Routes = [{ path: '', component: VirtualisationEnvironmentComponent }];

@NgModule({
  declarations: [VirtualisationEnvironmentComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(), MatStepperModule,
  ],
  exports: [RouterModule],
})
export class VirtEnvModule {}
