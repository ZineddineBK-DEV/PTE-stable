/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  DashboardModule — RETIRED (lazy-loaded feature modules replace it) ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * This module was a monolith declaring 66+ components and importing every
 * heavy library (FullCalendar, ECharts, Leaflet, NgxDatatable, etc.),
 * causing the entire application to be bundled into a single chunk.
 *
 * It has been replaced by 11 lazy-loaded feature modules in ./modules/:
 *
 *   modules/dashboard-home/  → DashboardHomeModule   (/main, /tool)
 *   modules/vehicle/         → VehicleModule          (/vehicle)
 *   modules/room/            → RoomModule             (/room)
 *   modules/technician/      → TechnicianModule       (/technician)
 *   modules/users/           → UsersModule            (/userList, /userRequest, /external)
 *   modules/profile/         → ProfileModule          (/profile, /user-profile/:id)
 *   modules/leave/           → LeaveModule            (/leave, /myLeave)
 *   modules/labs/            → LabsModule             (/virt-env, /myRequest)
 *   modules/internships/     → InternshipsModule      (/interns, /offer, etc.)
 *   modules/inventory/       → InventoryModule        (/inventory, /equipment, /accessory)
 *   modules/network/         → NetworkModule          (/networkRequests)
 *   modules/shared/          → SharedEventModalsModule (cross-cutting event modals)
 *
 * app-routing.module.ts now lazy-loads each module independently.
 * See app-routing.module.ts for the complete route map.
 *
 * ⚠️  To revert: restore this file from git history and revert
 *     app-routing.module.ts to load DashboardModule at path 'dashboard'.
 *
 * The original declarations list is preserved below as a reference.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // All dashboard routes are now lazy-loaded from app-routing.module.ts
  // This module is no longer actively used for routing.
  { path: '', redirectTo: 'main', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class DashboardModule {}

/* ─────────────────────────────────────────────────────────────────────────
 * ORIGINAL DECLARATIONS (for reference / rollback):
 *
 * declarations: [
 *   MonthNamePipe,
 *   MainComponent,
 *   Dashboard2Component,
 *   UserListComponent,
 *   UserRequestComponent,
 *   UserDetailsComponent,
 *   RoomComponent,
 *   ToolComponent,
 *   TechnicianComponent,
 *   VirtualisationEnvironmentComponent,
 *   VehicleComponent,
 *   AddEventModalComponent,
 *   EditVehicleModalComponent,
 *   AddVehicleModalComponent,
 *   EventInfoModalComponent,
 *   AddRoomModalComponent,
 *   EditRoomModalComponent,
 *   AddRoomEventModalComponent,
 *   EventInfoRoomModalComponent,
 *   EventInfoTechModalComponent,
 *   TechPersonalDetailsModalComponent,
 *   AddTechnicianEventModalComponent,
 *   MyRequestsComponent,
 *   LeaveComponent,
 *   MyLeaveRequestsComponent,
 *   ProfileComponent,
 *   EducationFormComponent,
 *   ExperienceFormComponent,
 *   CertificationFormComponent,
 *   ProjectFormComponent,
 *   SkillsFormComponent,
 *   EditProjectFormComponent,
 *   EditSkillsFormComponent,
 *   EditCertificationFormComponent,
 *   EditExperienceFormComponent,
 *   EditEducationFormComponent,
 *   EditSummaryFormComponent,
 *   DownloadCVComponent,
 *   UserProfileComponent,
 *   EditEventComponent,
 *   EditRoomEventComponent,
 *   EditTechEventComponent,
 *   LeaveDocComponent,
 *   RequestApprovalModalComponent,
 *   EditLanguageModalComponent,
 *   LanguageModalComponent,
 *   LogModalComponent,
 *   ExternalUserComponent,
 *   AddExternalModalComponent,
 *   ShowSigComponent,
 *   PreviewDocsModalComponent,
 *   InternsRequestComponent,
 *   OffersComponent,
 *   CreateOfferComponent,
 *   OfferPipe,
 *   OfferDetailsComponent,
 *   EditOfferComponent,
 *   AssignQuizToOfferComponent,
 *   FillQuizComponent,
 *   AllOfferDetailsComponent,
 *   SelectedUserResultComponent,
 *   SelectedInternComponent,
 *   TasksComponent,
 *   AddTaskComponent,
 *   LabDetailsComponent,
 *   NetworkRequestsComponent,
 *   DocsComponent,
 *   InventoryComponent,
 *   EquipmentTypeComponent,
 *   AccessoryTypeComponent,
 *   ForwardItemComponent,
 *   GasCardComponent,
 *   VehicleStatComponent,
 *   InternsMeetingRequestsComponent,
 *   RequestMeetingInfoComponent,
 *   AddInternModalComponent,
 *   InternDocsComponent,
 *   LeaveKPIComponent,
 *   MissionKpiComponent,
 *   MyMissionKpiComponent,
 *   MyLeaveKpiComponent,
 *   LabsKpisComponent,
 * ],
 *
 * imports: [
 *   CommonModule,
 *   NgbModule,
 *   NgxPrintModule,
 *   DashboardRoutingModule,
 *   NgxDatatableModule,
 *   ToastrModule.forRoot({ positionClass: 'toast-bottom-left' }),
 *   NgxEchartsModule.forRoot({ echarts: () => import('echarts') }),
 *   NgScrollbarModule,
 *   NgApexchartsModule,
 *   NgbProgressbarModule,
 *   NgxGaugeModule,
 *   FullCalendarModule,
 *   ReactiveFormsModule,
 *   FormsModule,
 *   NgxDropzoneModule,
 *   MatStepperModule,
 *   NgxMaskDirective,
 *   LeafletModule,
 *   NgSelectModule,
 *   BaseChartDirective,
 * ],
 *
 * providers: [provideNgxMask()],
 * ───────────────────────────────────────────────────────────────────────── */
