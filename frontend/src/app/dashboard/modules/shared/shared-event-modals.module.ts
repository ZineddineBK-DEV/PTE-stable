/**
 * SharedEventModalsModule
 * 
 * Contains the 6 cross-cutting event-info + edit-event modal components
 * used by both DashboardHomeModule (main dashboard calendar) and the
 * individual resource modules (VehicleModule, RoomModule, TechnicianModule).
 *
 * These are opened dynamically via NgbModal — they must be declared in a
 * module that every consumer imports.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

// ─── Vehicle event modals ──────────────────────────────────────────────
import { EventInfoModalComponent } from '../../vehicle/event-info-modal/event-info-modal.component';
import { EditEventComponent } from '../../vehicle/edit-event/edit-event.component';

// ─── Room event modals ─────────────────────────────────────────────────
import { EventInfoRoomModalComponent } from '../../room/event-info-room-modal/event-info-room-modal.component';
import { EditRoomEventComponent } from '../../room/edit-room-event/edit-room-event.component';

// ─── Technician event modals ───────────────────────────────────────────
import { EventInfoTechModalComponent } from '../../technician/event-info-tech-modal/event-info-tech-modal.component';
import { EditTechEventComponent } from '../../technician/edit-tech-event/edit-tech-event.component';

@NgModule({
  declarations: [
    // Vehicle
    EventInfoModalComponent,
    EditEventComponent,
    // Room
    EventInfoRoomModalComponent,
    EditRoomEventComponent,
    // Technician
    EventInfoTechModalComponent,
    EditTechEventComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forChild(),
  ],
  exports: [
    EventInfoModalComponent,
    EditEventComponent,
    EventInfoRoomModalComponent,
    EditRoomEventComponent,
    EventInfoTechModalComponent,
    EditTechEventComponent,
  ],
})
export class SharedEventModalsModule {}
