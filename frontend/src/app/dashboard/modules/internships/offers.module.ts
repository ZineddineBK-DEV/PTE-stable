import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { OffersComponent } from '../../offers/offers.component';
import { CreateOfferComponent } from '../../offers/create-offer/create-offer.component';
import { OfferDetailsComponent } from '../../offers/offer-details/offer-details.component';
import { EditOfferComponent } from '../../offers/edit-offer/edit-offer.component';
import { FillQuizComponent } from '../../offers/fill-quiz/fill-quiz.component';
import { OfferPipe } from '../../../core/pipes/offer.pipe';
import { OffersSharedModule } from '../shared/offers-shared.module';

const routes: Routes = [{ path: '', component: OffersComponent }];

@NgModule({
  declarations: [
    OffersComponent, CreateOfferComponent, OfferDetailsComponent,
    EditOfferComponent, FillQuizComponent, OfferPipe,
  ],
  imports: [
    CommonModule, NgbModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(), OffersSharedModule,
  ],
  exports: [RouterModule],
})
export class OffersModule {}
