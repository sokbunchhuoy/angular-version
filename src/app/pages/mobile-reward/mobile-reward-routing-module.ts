import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { List } from '@/pages/mobile-reward/list/list';


@NgModule({
    imports: [
        RouterModule.forChild([
                {path: '', redirectTo: 'list', pathMatch: 'full'},
                {path: 'list', component: List, data: {breadcrumb: 'List'}}
            ]
        ),
    ],
  exports: [RouterModule]
})
export class MobileRewardRoutingModule { }
