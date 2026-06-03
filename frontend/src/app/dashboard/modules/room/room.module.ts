/**
 * RoomModule
 *
 * Room calendar page with FullCalendar and NgxScrollbar.
 * Declares room sub-components: add/edit room modals, add-room-event modal.
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

// Components
import { RoomComponent } from '../../room/room.component';
import { AddRoomModalComponent } from '../../room/add-room-modal/add-room-modal.component';
import { EditRoomModalComponent } from '../../room/edit-room-modal/edit-room-modal.component';
import { AddRoomEventModalComponent } from '../../room/add-room-event-modal/add-room-event-modal.component';

// Shared event-info modals (EventInfoRoomModalComponent + EditRoomEventComponent)
import { SharedEventModalsModule } from '../shared/shared-event-modals.module';

const routes: Routes = [
  { path: '', component: RoomComponent },
];

@NgModule({
  declarations: [
    RoomComponent,
    AddRoomModalComponent,
    EditRoomModalComponent,
    AddRoomEventModalComponent,
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
    SharedEventModalsModule,
  ],
  exports: [RouterModule],
})
export class RoomModule {}
