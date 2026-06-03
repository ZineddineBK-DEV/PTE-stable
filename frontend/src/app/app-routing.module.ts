/**
 * AppRoutingModule — True Lazy-Loaded Architecture
 *
 * Every feature route loads its own module on first navigation.
 * The old monolith DashboardModule (66+ components, all heavy libraries)
 * has been split into 22 feature modules.  The user only downloads the
 * code for the page they actually visit.
 *
 * ┌───────────────────────────────┬──────────────────────────────────────┐
 * │ URL                           │ Module (lazy chunk)                  │
 * ├───────────────────────────────┼──────────────────────────────────────┤
 * │ /dashboard/main               │ DashboardHomeModule (charts+calendar)│
 * │ /dashboard/vehicle            │ VehicleModule   (FullCalendar+Leaf.) │
 * │ /dashboard/room               │ RoomModule      (FullCalendar)       │
 * │ /dashboard/technician         │ TechnicianModule (FullCalendar+Leaf.)│
 * │ /dashboard/userList           │ UserListModule   (NgxDatatable)      │
 * │ /dashboard/userRequest        │ UserRequestModule (NgxDatatable)     │
 * │ /dashboard/external           │ ExternalModule   (NgxDatatable)      │
 * │ /dashboard/profile            │ ProfileModule    (forms+dropzone)    │
 * │ /dashboard/user-profile/:id   │ UserProfileModule                    │
 * │ /dashboard/leave              │ LeaveModule      (dropzone)          │
 * │ /dashboard/myLeave            │ MyLeaveModule                        │
 * │ /dashboard/virt-env           │ VirtEnvModule    (MatStepper)        │
 * │ /dashboard/myRequest          │ MyRequestsModule                     │
 * │ /dashboard/interns            │ InternsRequestModule (NgxDatatable)  │
 * │ /dashboard/offer              │ OffersModule                         │
 * │ /dashboard/offerDetails/:id   │ OfferDetailsModule                   │
 * │ /dashboard/offerTasks/:id     │ TasksModule                          │
 * │ /dashboard/selected-intern    │ SelectedInternModule (NgxDatatable)  │
 * │ /dashboard/interns-meeting…   │ MeetingRequestsModule (FullCalendar) │
 * │ /dashboard/intern-docs/:id    │ InternDocsRouteModule                │
 * │ /dashboard/inventory          │ InventoryModule                      │
 * │ /dashboard/networkRequests    │ NetworkModule                        │
 * └───────────────────────────────┴──────────────────────────────────────┘
 *
 * Shared (non-routed) modules imported by feature modules:
 *   SharedEventModalsModule  — 6 event-info + edit-event modals
 *   ProfileSharedModule      — DownloadCVComponent, ShowSigComponent
 *   InternDocsSharedModule   — InternDocsComponent
 *   OffersSharedModule       — AssignQuizToOfferComponent, SelectedUserResultComponent
 *
 * Angular CLI automatically creates shared chunks for libraries used by
 * multiple feature modules (e.g. FullCalendar, NgxDatatable).
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { NewLayoutComponent } from './layout/app-layout/new-layout/new-layout.component';
import { Page404Component } from './authentication/page404/page404.component';

const routes: Routes = [
  // ─── Authenticated area ──────────────────────────────────────────────
  {
    path: '',
    component: NewLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },

      {
        path: 'dashboard',
        children: [
          { path: '', redirectTo: 'main', pathMatch: 'full' },

          // ─── Dashboard Home ─────────────────────────────────────────
          {
            path: 'main',
            loadChildren: () =>
              import('./dashboard/modules/dashboard-home/dashboard-home.module').then(
                (m) => m.DashboardHomeModule
              ),
          },

          // ─── Resources (Vehicle / Room / Technician) ────────────────
          {
            path: 'vehicle',
            loadChildren: () =>
              import('./dashboard/modules/vehicle/vehicle.module').then(
                (m) => m.VehicleModule
              ),
          },
          {
            path: 'room',
            loadChildren: () =>
              import('./dashboard/modules/room/room.module').then(
                (m) => m.RoomModule
              ),
          },
          {
            path: 'technician',
            loadChildren: () =>
              import('./dashboard/modules/technician/technician.module').then(
                (m) => m.TechnicianModule
              ),
          },

          // ─── Users ─────────────────────────────────────────────────
          {
            path: 'userList',
            loadChildren: () =>
              import('./dashboard/modules/users/user-list.module').then(
                (m) => m.UserListModule
              ),
          },
          {
            path: 'userRequest',
            loadChildren: () =>
              import('./dashboard/modules/users/user-request.module').then(
                (m) => m.UserRequestModule
              ),
          },
          {
            path: 'external',
            loadChildren: () =>
              import('./dashboard/modules/users/external.module').then(
                (m) => m.ExternalModule
              ),
          },

          // ─── Profile ───────────────────────────────────────────────
          {
            path: 'profile',
            loadChildren: () =>
              import('./dashboard/modules/profile/profile.module').then(
                (m) => m.ProfileModule
              ),
          },
          {
            path: 'user-profile/:id',
            loadChildren: () =>
              import('./dashboard/modules/profile/user-profile.module').then(
                (m) => m.UserProfileModule
              ),
          },

          // ─── Leave ─────────────────────────────────────────────────
          {
            path: 'leave',
            loadChildren: () =>
              import('./dashboard/modules/leave/leave.module').then(
                (m) => m.LeaveModule
              ),
          },
          {
            path: 'myLeave',
            loadChildren: () =>
              import('./dashboard/modules/leave/my-leave.module').then(
                (m) => m.MyLeaveModule
              ),
          },

          // ─── Labs / Virtualisation ──────────────────────────────────
          {
            path: 'virt-env',
            loadChildren: () =>
              import('./dashboard/modules/labs/virt-env.module').then(
                (m) => m.VirtEnvModule
              ),
          },
          {
            path: 'myRequest',
            loadChildren: () =>
              import('./dashboard/modules/labs/my-requests.module').then(
                (m) => m.MyRequestsModule
              ),
          },

          // ─── Internships / Offers / Tasks ──────────────────────────
          {
            path: 'interns',
            loadChildren: () =>
              import('./dashboard/modules/internships/interns-request.module').then(
                (m) => m.InternsRequestModule
              ),
          },
          {
            path: 'offer',
            loadChildren: () =>
              import('./dashboard/modules/internships/offers.module').then(
                (m) => m.OffersModule
              ),
          },
          {
            path: 'offerDetails/:id',
            loadChildren: () =>
              import('./dashboard/modules/internships/offer-details.module').then(
                (m) => m.OfferDetailsModule
              ),
          },
          {
            path: 'offerTasks/:id',
            loadChildren: () =>
              import('./dashboard/modules/internships/tasks.module').then(
                (m) => m.TasksModule
              ),
          },
          {
            path: 'selected-intern',
            loadChildren: () =>
              import('./dashboard/modules/internships/selected-intern.module').then(
                (m) => m.SelectedInternModule
              ),
          },
          {
            path: 'interns-meeting-requests',
            loadChildren: () =>
              import('./dashboard/modules/internships/meeting-requests.module').then(
                (m) => m.MeetingRequestsModule
              ),
          },
          {
            path: 'intern-docs/:id',
            loadChildren: () =>
              import('./dashboard/modules/internships/intern-docs.module').then(
                (m) => m.InternDocsRouteModule
              ),
          },

          // ─── Inventory (equipment / accessory are modals inside this) ─
          {
            path: 'inventory',
            loadChildren: () =>
              import('./dashboard/modules/inventory/inventory.module').then(
                (m) => m.InventoryModule
              ),
          },
          {
            path: 'equipment',
            redirectTo: 'inventory',
          },
          {
            path: 'accessory',
            redirectTo: 'inventory',
          },

          // ─── Network Requests ──────────────────────────────────────
          {
            path: 'networkRequests',
            loadChildren: () =>
              import('./dashboard/modules/network/network.module').then(
                (m) => m.NetworkModule
              ),
          },

          // ─── Legacy placeholder ────────────────────────────────────
          {
            path: 'tool',
            redirectTo: 'main',
          },
        ],
      },
    ],
  },

  // ─── Authentication ──────────────────────────────────────────────────
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },

  // ─── Newspaper (no AuthGuard) ────────────────────────────────────────
  {
    path: '',
    component: NewLayoutComponent,
    loadChildren: () =>
      import('./newspaper/newspaper.module').then((m) => m.NewspaperModule),
  },

  // ─── 404 ─────────────────────────────────────────────────────────────
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
