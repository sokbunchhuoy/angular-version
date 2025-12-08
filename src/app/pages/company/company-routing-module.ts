import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { List } from '@/pages/company/list/list';
import { ListProduct } from '@/pages/company/list-product/list-product';

@NgModule({
  imports: [
      RouterModule.forChild([
          {path: '', redirectTo: 'list', pathMatch: 'full'},
          {path: 'list', component: List, data: {breadcrumb: 'List'}},
          {path: 'list-product', component: ListProduct, data: {breadcrumb: 'List Product'}},
          ]
      ),
  ],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
