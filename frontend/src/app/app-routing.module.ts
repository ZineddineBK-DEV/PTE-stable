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
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
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

  // ─── Newspaper ───────────────────────────────────────────────────────
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
