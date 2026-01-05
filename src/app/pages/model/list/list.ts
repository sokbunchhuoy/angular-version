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
import { Model } from '@/pages/model/model.model';
import { ModelService } from '@/pages/model/model.serivce';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-list',
    imports: [Button, ConfirmDialog, InputText, PrimeTemplate, ProgressBar, ReactiveFormsModule, RouterLink, TableModule, Toast, Toolbar, FormsModule],
    templateUrl: './list.html',
    providers: [MessageService, ConfirmationService]
})
export class List implements OnInit {
    // Signals for data and loading state
    product = signal<Product[]>([]);
    model = signal<Model[]>([]);
    loading = signal<boolean>(false);

    // Search filter variables
    searchCode = '';
    searchName = '';

    // Pagination defaults
    rows = 10;
    rowsPerPageOptions = [10, 20, 50];

    constructor(
        private service: ModelService, // Assuming you have a service
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
            name: this.searchName
        };

        // Fetch both Models and Products simultaneously
        forkJoin({
            models: this.service.getModel(params),
            products: this.service.getProducts()
        }).subscribe({
            next: ({ models, products }) => {
                // Map each model to include its full product object
                const joinedData = models.map(model => {
                    // Find the product matching the model's productId
                    const productInfo = products.find(p => p.id === model.productId);
                    return {
                        ...model,
                        product: productInfo // Assign the object so the HTML can read .code and .name
                    };
                });

                // Apply your local search filter (optional if handled by server)
                const filteredResults = joinedData.filter((item: any) => {
                    const searchName = this.searchName.toLowerCase().trim();
                    const searchCode = this.searchCode.toLowerCase().trim();
                    const nameMatches = !searchName || item.name?.toLowerCase().includes(searchName);
                    const codeMatches = !searchCode || item.code?.toLowerCase().includes(searchCode);
                    return nameMatches && codeMatches;
                });

                this.model.set(filteredResults);
                this.loading.set(false);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data' });
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
            message: 'Are you sure you want to delete this model?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.service.delete(id).subscribe(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: 'Model removed successfully'
                    });
                    this.getList();
                });
            }
        });
    }
}
