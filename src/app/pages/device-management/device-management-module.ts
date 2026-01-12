import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceManagementRoutingModule } from './device-management-routing-module';
import { List } from '@/pages/device-management/list/list';
import { AddEdit } from '@/pages/device-management/add-edit/add-edit';
import { Detail } from '@/pages/device-management/detail/detail';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DeviceManagementRoutingModule,
      List,
      AddEdit,
      Detail
  ]
})
export class DeviceManagementModule { }
