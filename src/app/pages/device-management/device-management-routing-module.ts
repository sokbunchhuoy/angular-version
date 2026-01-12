import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { List } from '@/pages/device-management/list/list';
import { Detail } from '@/pages/device-management/detail/detail';
import { AddEdit } from '@/pages/device-management/add-edit/add-edit';

const routes: Routes = [];

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
export class DeviceManagementRoutingModule { }
