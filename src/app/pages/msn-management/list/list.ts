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
import { Model } from '@/pages/model/model.model';
import { forkJoin } from 'rxjs';
import { MsnManagement } from '@/pages/msn-management/msn-management.model';
import { MsnManagementService } from '@/pages/msn-management/msn-management.service';
import { Manufacturer } from '@/pages/manufacturer/manufacturer.model';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-list',
    imports: [Button, ConfirmDialog, InputText, PrimeTemplate, ProgressBar, ReactiveFormsModule, RouterLink, TableModule, Toast, Toolbar, FormsModule, DatePipe],
    templateUrl: './list.html',
    styleUrl: './list.scss',
    providers: [MessageService, ConfirmationService]
})
export class List implements OnInit {
    // Signals for data and loading state
    product = signal<Product[]>([]);
    manufacturer = signal<Manufacturer[]>([]);
    model = signal<Model[]>([]);
    msnManagement = signal<MsnManagement[]>([]);
    loading = signal<boolean>(false);

    // Search filter variables
    searchCode = '';

    // Pagination defaults
    rows = 10;
    rowsPerPageOptions = [10, 20, 50];

    constructor(
        private service: MsnManagementService, // Assuming you have a service
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getList();
    }

    getList() {
        this.loading.set(true);

        forkJoin({
            msnData: this.service.getMsnManagement(),
            products: this.service.getProducts(),
            manufacturers: this.service.getManufacturer(),
            models: this.service.getModel() // Added Models
        }).subscribe({
            next: ({ msnData, products, manufacturers, models }) => {
                const joinedData = msnData.map((item) => {
                    // If your JSON has 'manufacture' (object) but your interface needs 'manufacturer'
                    // and you want to find by ID if the object is missing:
                    return {
                        ...item,
                        manufacturer: item.manufacturer || manufacturers.find((m) => String(m.id) === String(item.manufacturerId)),
                        product: item.product || products.find((p) => String(p.id) === String(item.productId)),
                        model: item.model || models.find((mo) => String(mo.id) === String(item.modelId))
                    };
                });

                const searchCode = this.searchCode.toLowerCase().trim();
                const filteredResults = joinedData.filter((item) => {
                    if (!searchCode) return true;
                    return item.code?.toLowerCase().includes(searchCode);
                });

                this.msnManagement.set(filteredResults);
                this.loading.set(false);
            },
            error: (err) => {
                this.loading.set(false);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load list data' });
            }
        });
    }

    // Helpful for the "Reset" or "Search" behavior
    onSearch() {
        this.getList();
    }

    clearSearch() {
        this.searchCode = '';

        this.getList();
    }

    onDelete(id: number) {
        this.confirmationService.confirm({
            key: 'delete',
            message: 'Are you sure you want to delete this msn management?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.service.delete(id).subscribe(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: 'msn management removed successfully'
                    });
                    this.getList();
                });
            }
        });
    }
}
