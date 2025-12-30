import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerminalRoutingModule } from './terminal-routing-module';
import { List } from '@/pages/terminal/list/list';
import { AddEdit } from '@/pages/terminal/add-edit/add-edit';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        TerminalRoutingModule,
        List,
        AddEdit
    ]
})
export class TerminalModule {}
