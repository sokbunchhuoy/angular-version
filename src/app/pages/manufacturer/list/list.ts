import { Component, OnInit, signal } from '@angular/core';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { Button, ButtonDirective } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import { InputText } from 'primeng/inputtext';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ProgressBar } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { ManufacturerService } from '@/pages/manufacturer/manufacturer.service';
import { Manufacturer } from '@/pages/manufacturer/manufacturer.model';

@Component({
    selector: 'app-list',
    imports: [ConfirmDialog, Toast, Button, Toolbar, InputText, PrimeTemplate, FormsModule, ProgressBar, TableModule, RouterLink],
    templateUrl: './list.html',
    styleUrl: './list.scss',
    providers: [MessageService, ConfirmationService]
})
export class List implements OnInit {
    // Signals for data and loading state
    manufacturers = signal<Manufacturer[]>([]);
    loading = signal<boolean>(false);

    // Search filter variables
    searchCode = '';
    searchName = '';
    searchPhone = '';
    searchEmail = '';

    // Pagination defaults
    rows = 10;
    rowsPerPageOptions = [10, 20, 50];

    constructor(
        private service: ManufacturerService, // Assuming you have a service
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);

        const params = {
            code: this.searchCode,
            name: this.searchName,
            phone: this.searchPhone,
            email: this.searchEmail
        };

        this.service.getManufacturers(params).subscribe({
            next: (data) => {
                // Filter the data locally to ensure strictly matching results
                const filteredResults = data.filter(item => {
                    const searchName = this.searchName.toLowerCase().trim();
                    const searchCode = this.searchCode.toLowerCase().trim();

                    // Only keep items that include the search text (case-insensitive)
                    const nameMatches = !searchName || item.name.toLowerCase().includes(searchName);
                    const codeMatches = !searchCode || item.code.toLowerCase().includes(searchCode);

                    return nameMatches && codeMatches;
                });

                this.manufacturers.set(filteredResults);
                this.loading.set(false);
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load data'
                });
                this.loading.set(false);
            }
        });
    }

    // Helpful for the "Reset" or "Search" behavior
    onSearch() {
        this.loadData();
    }

    clearSearch() {
        this.searchCode = '';
        this.searchName = '';
        this.searchPhone = '';
        this.searchEmail = '';
        this.loadData();
    }

    onDelete(id: number) {
        this.confirmationService.confirm({
            key: 'delete',
            message: 'Are you sure you want to delete this manufacturer?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.service.delete(id).subscribe(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: 'Manufacturer removed successfully'
                    });
                    this.loadData();
                });
            }
        });
    }
}
