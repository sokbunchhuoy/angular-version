import { Component, OnInit, WritableSignal } from '@angular/core';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { TerminalModel } from '@/pages/terminal/terminal.model';
import { TerminalPostService } from '@/pages/terminal/terminal.serivce';
import { ProgressBar } from 'primeng/progressbar';
import { Tag } from 'primeng/tag';
import { delay } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

@Component({
    selector: 'app-list',
    imports: [TableModule, Button, ConfirmDialog, Toast, Toolbar, RouterModule, ProgressBar, Tag, InputText, ReactiveFormsModule, FormsModule, Select],
    templateUrl: './list.html',
    styleUrl: './list.scss',
    providers: [MessageService, ConfirmationService]
})
export class List implements OnInit {
    // Declare properties first
    terminal!: WritableSignal<TerminalModel[]>;
    loading!: WritableSignal<boolean>;

    rows: number = 10;
    rowsPerPageOptions: number[] = [5, 10, 20];
    searchTerm: string = '';
    selectedStatus: boolean | null = null;

    // Status options for the dropdown
    statusOptions = [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' }
    ];
    constructor(
        private service: TerminalPostService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router
    ) {
        // Initialize here, after the service is injected
        this.terminal = this.service.terminal;
        this.loading = this.service.loading;
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        // Pass both search term and status
        this.service
            .getTerminals(this.searchTerm, this.selectedStatus || undefined)
            .pipe(delay(1500))
            .subscribe({
                complete: () => this.loading.set(false)
            });
    }

    // Optional: Add a clear search method
    clearSearch() {
        this.searchTerm = '';
        this.selectedStatus = null;
        this.loadData();
    }

    onDelete(id: string | number) {
        this.confirmationService.confirm({
            key: 'delete',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            message: 'Are you sure you want to delete this record?',
            accept: () => {
                // The dialog closes automatically once "Yes" is clicked
                this.service.delete(id).subscribe({
                    next: () => {
                        // 1. Trigger the Success Message
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Deleted successfully'
                        });

                        // 2. Reload the list data to show "No record available"
                        this.loadData();
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete record'
                        });
                        console.error(err);
                    }
                });
            }
        });
    }
}
