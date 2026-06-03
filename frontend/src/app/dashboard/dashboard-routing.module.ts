/**
 * DashboardRoutingModule — RETIRED
 *
 * All routes have been moved to app-routing.module.ts as lazy-loaded
 * feature module imports.  This file is kept as a shell so that the
 * import in dashboard.module.ts still compiles, but it defines no routes.
 *
 * See app-routing.module.ts for the active route definitions.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
