/**
 * TechnicianModule
 *
 * Technician calendar page with FullCalendar, Leaflet for event location,
 * and NgxScrollbar.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

// Heavy libraries
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxScrollbarModule } from 'ngx-scrollbar';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// Components
import { TechnicianComponent } from '../../technician/technician.component';
import { TechPersonalDetailsModalComponent } from '../../technician/tech-personal-details-modal/tech-personal-details-modal.component';
import { AddTechnicianEventModalComponent } from '../../technician/add-technician-event-modal/add-technician-event-modal.component';
import { LogModalComponent } from '../../technician/log-modal/log-modal.component';

// Shared event-info modals (EventInfoTechModalComponent + EditTechEventComponent)
import { SharedEventModalsModule } from '../shared/shared-event-modals.module';

const routes: Routes = [
  { path: '', component: TechnicianComponent },
];

@NgModule({
  declarations: [
    TechnicianComponent,
    TechPersonalDetailsModalComponent,
    AddTechnicianEventModalComponent,
    LogModalComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ToastrModule.forChild(),
    FullCalendarModule,
    NgxScrollbarModule,
    LeafletModule,
    SharedEventModalsModule,
  ],
  exports: [RouterModule],
})
export class TechnicianModule {}
