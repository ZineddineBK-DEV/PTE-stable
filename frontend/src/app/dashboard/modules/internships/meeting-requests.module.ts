import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { FullCalendarModule } from '@fullcalendar/angular';

import { InternsMeetingRequestsComponent } from '../../interns-meeting-requests/interns-meeting-requests.component';
import { RequestMeetingInfoComponent } from '../../interns-meeting-requests/request-meeting-info/request-meeting-info.component';

const routes: Routes = [{ path: '', component: InternsMeetingRequestsComponent }];

@NgModule({
  declarations: [InternsMeetingRequestsComponent, RequestMeetingInfoComponent],
  imports: [
    CommonModule, NgbModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(), FullCalendarModule,
  ],
  exports: [RouterModule],
})
export class MeetingRequestsModule {}
