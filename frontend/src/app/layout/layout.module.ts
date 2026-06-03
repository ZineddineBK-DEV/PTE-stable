import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './footer/footer.component';
import { NewLayoutComponent } from './app-layout/new-layout/new-layout.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
  ],
  declarations: [
    FooterComponent,
    NewLayoutComponent,
  ],
  exports: [
    NewLayoutComponent,
  ],
})
export class LayoutModule {}
