import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsnManagementRoutingModule } from './msn-management-routing-module';
import { List } from '@/pages/msn-management/list/list';
import { AddEdit } from '@/pages/msn-management/add-edit/add-edit';
import { Detail } from '@/pages/msn-management/detail/detail';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MsnManagementRoutingModule,
      List,
      AddEdit,
      Detail
  ]
})
export class MsnManagementModule { }
