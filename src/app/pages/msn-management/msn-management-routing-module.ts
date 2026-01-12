import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { List } from '@/pages/msn-management/list/list';
import { AddEdit } from '@/pages/msn-management/add-edit/add-edit';
import { Detail } from '@/pages/msn-management/detail/detail';

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
export class MsnManagementRoutingModule { }
