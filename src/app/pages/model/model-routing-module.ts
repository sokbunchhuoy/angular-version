import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { List } from '@/pages/model/list/list';
import { Detail } from '@/pages/model/detail/detail';
import { AddEdit } from '@/pages/model/add-edit/add-edit';

@NgModule({
    imports: [
        RouterModule.forChild([
                {path: '', redirectTo: 'list', pathMatch: 'full'},
                {path: 'list', component: List, data: {breadcrumb: 'List'}},
                {path: 'detail/:id', component: Detail, data: {breadcrumb: 'Detail'}},
                {path: 'add', component: AddEdit, data: {breadcrumb: 'Add'}},
                {path: 'edit/:id', component: AddEdit, data: {breadcrumb: 'Edit'}},
            ]
        ),
    ],
  exports: [RouterModule]
})
export class ModelRoutingModule { }
