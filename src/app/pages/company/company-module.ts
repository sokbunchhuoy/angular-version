import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing-module';
import { List } from '@/pages/company/list/list';
import { ListProduct } from '@/pages/company/list-product/list-product';

@NgModule({
    declarations: [],
    imports: [CommonModule, CompanyRoutingModule, List, ListProduct]
})
export class CompanyModule {}
