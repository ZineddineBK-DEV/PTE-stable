/**
 * DashboardHomeModule
 *
 * Main dashboard page with calendar, KPIs, and charts.
 * This is the heaviest module because the dashboard home needs:
 *   - FullCalendar (mini calendar widget)
 *   - ng2-charts (KPI charts)
 *   - NgxDatatable (recent activity table)
 *   - NgxEcharts / NgApexcharts / NgxGauge (Dashboard2 analytics — loaded together)
 *
 * Opens event-info modals from SharedEventModalsModule when calendar events are clicked.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

// Heavy libraries — only loaded with this module
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxScrollbarModule } from 'ngx-scrollbar';
import { BaseChartDirective } from 'ng2-charts';

// Components
import { MainComponent } from '../../main/main.component';
import { Dashboard2Component } from '../../dashboard2/dashboard2.component';
import { LeaveKPIComponent } from '../../main/leave-kpi/leave-kpi.component';
import { MissionKpiComponent } from '../../main/mission-kpi/mission-kpi.component';
import { MyMissionKpiComponent } from '../../main/my-mission-kpi/my-mission-kpi.component';
import { MyLeaveKpiComponent } from '../../main/my-leave-kpi/my-leave-kpi.component';
import { LabsKpisComponent } from '../../main/labs-kpis/labs-kpis.component';

// Pipes
import { MonthNamePipe } from '../../../core/pipes/month-name.pipe';

// Shared event modals (opened via NgbModal from MainComponent)
import { SharedEventModalsModule } from '../shared/shared-event-modals.module';

const routes: Routes = [
  { path: '', component: MainComponent },
];

@NgModule({
  declarations: [
    MainComponent,
    Dashboard2Component,
    LeaveKPIComponent,
    MissionKpiComponent,
    MyMissionKpiComponent,
    MyLeaveKpiComponent,
    LabsKpisComponent,
    MonthNamePipe,
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgbProgressbarModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ToastrModule.forChild(),
    FullCalendarModule,
    NgxDatatableModule,
    NgxEchartsModule.forRoot({ echarts: () => import('echarts') }),
    NgApexchartsModule,
    NgxGaugeModule,
    NgxScrollbarModule,
    BaseChartDirective,
    SharedEventModalsModule,
  ],
  exports: [RouterModule],
})
export class DashboardHomeModule {}
