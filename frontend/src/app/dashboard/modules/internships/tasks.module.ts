import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { TasksComponent } from '../../tasks/tasks.component';
import { AddTaskComponent } from '../../tasks/add-task/add-task.component';

const routes: Routes = [{ path: '', component: TasksComponent }];

@NgModule({
  declarations: [TasksComponent, AddTaskComponent],
  imports: [
    CommonModule, NgbModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(),
  ],
  exports: [RouterModule],
})
export class TasksModule {}
