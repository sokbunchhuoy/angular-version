import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddEdit } from '@/pages/company-management/add-edit/add-edit';
import { List } from '@/pages/company-management/list/list';
import { Detail } from '@/pages/company-management/detail/detail';

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
export class CompanyManagementRoutingModule { }
