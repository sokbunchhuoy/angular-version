import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelRoutingModule } from './model-routing-module';
import { List } from '@/pages/model/list/list';
import { AddEdit } from '@/pages/model/add-edit/add-edit';
import { Detail } from '@/pages/model/detail/detail';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ModelRoutingModule,
      List,
      AddEdit,
      Detail
  ]
})
export class ModelModule { }
