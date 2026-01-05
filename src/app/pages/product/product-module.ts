import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing-module';
import { List } from '@/pages/product/list/list';
import { AddEdit } from '@/pages/product/add-edit/add-edit';
import { Detail } from '@/pages/product/detail/detail';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ProductRoutingModule,
        List,
        AddEdit,
        Detail
    ]
})
export class ProductModule {}
