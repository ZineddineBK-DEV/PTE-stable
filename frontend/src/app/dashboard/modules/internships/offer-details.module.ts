import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { AllOfferDetailsComponent } from '../../offers/all-offer-details/all-offer-details.component';
import { OffersSharedModule } from '../shared/offers-shared.module';

const routes: Routes = [{ path: '', component: AllOfferDetailsComponent }];

@NgModule({
  declarations: [AllOfferDetailsComponent],
  imports: [
    CommonModule, NgbModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(), OffersSharedModule,
  ],
  exports: [RouterModule],
})
export class OfferDetailsModule {}
