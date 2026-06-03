import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxScrollbarModule } from 'ngx-scrollbar';

import { InventoryComponent } from '../../inventory/inventory.component';
import { EquipmentTypeComponent } from '../../inventory/equipment-type/equipment-type.component';
import { AccessoryTypeComponent } from '../../inventory/accessory-type/accessory-type.component';
import { ForwardItemComponent } from '../../inventory/forward-item/forward-item.component';

const routes: Routes = [{ path: '', component: InventoryComponent }];

@NgModule({
  declarations: [
    InventoryComponent, EquipmentTypeComponent,
    AccessoryTypeComponent, ForwardItemComponent,
  ],
  imports: [
    CommonModule, NgbModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ToastrModule.forChild(), NgxScrollbarModule,
  ],
  exports: [RouterModule],
})
export class InventoryModule {}
