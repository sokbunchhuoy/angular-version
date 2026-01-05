import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManufacturerRoutingModule } from './manufacturer-routing-module';
import { Detail } from '@/pages/manufacturer/detail/detail';
import { List } from '@/pages/manufacturer/list/list';
import { AddEdit } from '@/pages/manufacturer/add-edit/add-edit';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ManufacturerRoutingModule,
        Detail,
        List,
        AddEdit
    ]
})
export class ManufacturerModule {}
