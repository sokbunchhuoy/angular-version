import { Component, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputText } from 'primeng/inputtext';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { ProgressBar } from 'primeng/progressbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { Product } from '@/pages/product/product.model';
import { ProductService } from '@/pages/product/product.service';

@Component({
    selector: 'app-list',
    imports: [Button, ConfirmDialog, InputText, PrimeTemplate, ProgressBar, ReactiveFormsModule, RouterLink, TableModule, Toast, Toolbar, FormsModule],
    templateUrl: './list.html',
    styleUrl: './list.scss',
    providers: [MessageService, ConfirmationService]
})
export class List implements OnInit {
    // Signals for data and loading state
    product = signal<Product[]>([]);
    loading = signal<boolean>(false);

    // Search filter variables
    searchCode = '';
    searchName = '';

    // Pagination defaults
    rows = 10;
    rowsPerPageOptions = [10, 20, 50];

    constructor(
        private service: ProductService, // Assuming you have a service
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getList();
    }

    getList() {
        this.loading.set(true);

        const params = {
            code: this.searchCode,
            name: this.searchName,
        };

        this.service.getProduct(params).subscribe({
            next: (data) => {
                // Filter the data locally to ensure strictly matching results
                const filteredResults = data.filter((item) => {
                    const searchName = this.searchName.toLowerCase().trim();
                    const searchCode = this.searchCode.toLowerCase().trim();

                    // Only keep items that include the search text (case-insensitive)
                    const nameMatches = !searchName || item.name.toLowerCase().includes(searchName);
                    const codeMatches = !searchCode || item.code.toLowerCase().includes(searchCode);

                    return nameMatches && codeMatches;
                });

                this.product.set(filteredResults);
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
        this.getList();
    }

    clearSearch() {
        this.searchCode = '';
        this.searchName = '';
        this.getList();
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
                    this.getList();
                });
            }
        });
    }
}
