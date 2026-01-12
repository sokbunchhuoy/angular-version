import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyManagementRoutingModule } from './company-management-routing-module';
import { AddEdit } from '@/pages/company-management/add-edit/add-edit';
import { List } from '@/pages/company-management/list/list';
import { Detail } from '@/pages/company-management/detail/detail';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CompanyManagementRoutingModule,
      Detail,
      List,
      AddEdit
  ]
})
export class CompanyManagementModule { }
