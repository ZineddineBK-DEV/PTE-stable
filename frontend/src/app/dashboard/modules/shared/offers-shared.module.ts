import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

// Shared between OffersModule and OfferDetailsModule
import { AssignQuizToOfferComponent } from '../../offers/assign-quiz-to-offer/assign-quiz-to-offer.component';
import { SelectedUserResultComponent } from '../../offers/selected-user-result/selected-user-result.component';

@NgModule({
  declarations: [AssignQuizToOfferComponent, SelectedUserResultComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forChild(),
  ],
  exports: [AssignQuizToOfferComponent, SelectedUserResultComponent],
})
export class OffersSharedModule {}
