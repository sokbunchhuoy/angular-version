import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { List } from '@/pages/terminal/list/list';
import { AddEdit } from '@/pages/terminal/add-edit/add-edit';

@NgModule({
    imports: [
        RouterModule.forChild([
                {path: '', redirectTo: 'list', pathMatch: 'full'},
                {path: 'list', component: List, data: {breadcrumb: 'List'}},
                {path: 'add', component: AddEdit, data: {breadcrumb: 'Add'}},
                {path: 'edit/:id', component: AddEdit, data: {breadcrumb: 'Edit'}},
            ]
        ),
    ],
  exports: [RouterModule]
})
export class TerminalRoutingModule { }
