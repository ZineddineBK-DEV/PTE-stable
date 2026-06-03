/**
 * VehicleModule
 *
 * Vehicle calendar page with FullCalendar, NgxDatatable for vehicle list,
 * Leaflet for event location picking.
 *
 * All vehicle sub-components (add/edit/event-info modals, gas-card, vehicle-stat)
 * are declared here.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

// Heavy libraries
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxScrollbarModule } from 'ngx-scrollbar';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// Components
import { VehicleComponent } from '../../vehicle/vehicle.component';
import { AddEventModalComponent } from '../../vehicle/add-event-modal/add-event-modal.component';
import { AddVehicleModalComponent } from '../../vehicle/add-vehicle-modal/add-vehicle-modal.component';
import { EditVehicleModalComponent } from '../../vehicle/edit-vehicle-modal/edit-vehicle-modal.component';
import { GasCardComponent } from '../../vehicle/gas-card/gas-card.component';
import { VehicleStatComponent } from '../../vehicle/vehicle-stat/vehicle-stat.component';

// Shared event-info modals (EventInfoModalComponent + EditEventComponent)
import { SharedEventModalsModule } from '../shared/shared-event-modals.module';

const routes: Routes = [
  { path: '', component: VehicleComponent },
];

@NgModule({
  declarations: [
    VehicleComponent,
    AddEventModalComponent,
    AddVehicleModalComponent,
    EditVehicleModalComponent,
    GasCardComponent,
    VehicleStatComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ToastrModule.forChild(),
    FullCalendarModule,
    NgxDatatableModule,
    NgxScrollbarModule,
    LeafletModule,
    SharedEventModalsModule,
  ],
  exports: [RouterModule],
})
export class VehicleModule {}
