import { Component, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePipe } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { ProgressBar } from 'primeng/progressbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { CompanyManagement } from '@/pages/company-management/company-management.model';
import { CompanyManagementService } from '@/pages/company-management/company-management.service';
import { DeviceManagement } from '@/pages/device-management/device-management.model';
import { DeviceManagementService } from '@/pages/device-management/device-management.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-list',
    imports: [Button, ConfirmDialog, DatePipe, InputText, PrimeTemplate, ProgressBar, ReactiveFormsModule, RouterLink, TableModule, Toast, Toolbar, FormsModule],
    templateUrl: './list.html',
    styleUrl: './list.scss',
    providers: [MessageService, ConfirmationService]
})
export class List implements OnInit {
    // Signals for data and loading state
    device = signal<DeviceManagement[]>([]);
    company = signal<CompanyManagement[]>([]);
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
        private service: DeviceManagementService, // Assuming you have a service
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Onboarded':
                return 'bg-green-500 text-white'; // High contrast
            case 'Pending':
                return 'bg-yellow-400 text-gray-900'; // High contrast
            default:
                return 'bg-gray-100 text-gray-600';
        }
    }

    loadData() {
        this.loading.set(true);
        forkJoin({
            devices: this.service.getDevice(),
            companies: this.service.getCompany()
        }).subscribe({
            next: ({ devices, companies }) => {
                const mappedData: DeviceManagement[] = devices.map(dev => ({
                    ...dev,
                    // Fix: Use == to compare string IDs vs number IDs
                    // or use .toString() to ensure types overlap
                    company: companies.find(c => c.id?.toString() === dev.companyId?.toString()) || null
                }));

                // Filter logic remains the same
                const filteredResults = mappedData.filter(item => {
                    const searchName = this.searchName.toLowerCase().trim();
                    return !searchName || item.company?.name?.toLowerCase().includes(searchName);
                });

                this.device.set(filteredResults);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
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
            message: 'Are you sure you want to delete this device?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.service.delete(id).subscribe(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: 'Device removed successfully'
                    });
                    this.loadData();
                });
            }
        });
    }
}
