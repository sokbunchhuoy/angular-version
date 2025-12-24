import { Component, OnInit, signal } from '@angular/core';
import { ListProductService, Merchant, MerchantOption, Product } from '@/pages/company/list-product';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { CurrencyPipe } from '@angular/common';
import { RadioButton } from 'primeng/radiobutton';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { finalize } from 'rxjs';
import { ProgressBar } from 'primeng/progressbar';
import { Badge } from 'primeng/badge';
import { Constant } from '@/constant/constant';

@Component({
    selector: 'app-list-product',
    imports: [Button, ConfirmDialog, Dialog, InputNumber, InputText, PrimeTemplate, ReactiveFormsModule, TableModule, Toast, Toolbar, CurrencyPipe, RadioButton, Select, Tag, ConfirmDialogModule, ProgressBar, Badge],
    templateUrl: './list-product.html',
    styleUrl: './list-product.scss',
    providers: [MessageService, ConfirmationService]
})
export class ListProduct implements OnInit {

    getCategorySeverity(category: string) {
        return Constant.getCategorySeverity(category);
    }

    rows: number = 10;
    rowsPerPageOptions: number[] = [5, 10, 20];
    products = signal<Product[]>([]);
    productDialog: boolean = false; // State for showing/hiding the dialog
    form!: FormGroup;
    selectedProduct!: Product | null;
    loading = signal(false);
    categories = [
        { label: 'Accessories', value: 'Accessories' },
        { label: 'Clothing', value: 'Clothing' },
        { label: 'Electronics', value: 'Electronics' },
        { label: 'Fitness', value: 'Fitness' },
        { label: 'Home Goods', value: 'Home Goods' }
    ];

    statuses = [
        { label: 'In Stock', value: 'INSTOCK' },
        { label: 'Low Stock', value: 'LOWSTOCK' },
        { label: 'Out of Stock', value: 'OUTOFSTOCK' }
    ];

    merchantOptions: MerchantOption[] = [];

    constructor(
        private fb: FormBuilder,
        private productService: ListProductService,
        private msgService: MessageService, // Inject MessageService
        private confirmationService: ConfirmationService // Inject ConfirmationService
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.loadProducts();
        this.loadMerchants();
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    loadMerchants(): void {
        this.productService.getMerchants().subscribe((data: Merchant[]) => {
            this.merchantOptions = data.map((merchant) => ({
                label: `${merchant.merchantId} - ${merchant.merchantName}`,
                value: merchant
            }));
        });
    }

    // --- Helper Functions (Provided in the prompt) ---

    findIndexById(id: string): number {
        let index = -1;
        // Use this.products() to access the signal's value
        for (let i = 0; i < this.products().length; i++) {
            if (this.products()[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    // --- Form and State Management ---

    initForm(): void {
        this.form = this.fb.group({
            id: [null], // Hidden field for existing product ID
            code: ['', Validators.required],
            name: ['', Validators.required],
            price: [0, [Validators.required, Validators.min(0)]],
            category: ['', Validators.required],
            status: ['', Validators.required],
            merchant: ['', Validators.required],
            dStatus: [null]
        });
    }

    confirmApprove(): void {
        this.confirmationService.confirm({
            key: 'approve',
            message: 'Approve this product?',
            header: 'Confirmation',
            icon: 'pi pi-check-circle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',

            accept: () => {
                // ✅ show fields ONLY after Yes
                this.form.get('dStatus')?.setValue(1);

                // ✅ make them required only for approval
                this.form.get('status')?.setValidators([Validators.required]);
                this.form.get('merchant')?.setValidators([Validators.required]);
                this.form.get('status')?.updateValueAndValidity();
                this.form.get('merchant')?.updateValueAndValidity();

                this.msgService.add({ severity: 'success', summary: 'Approved', detail: 'Product approved successfully.' });
            },

            reject: () => {
                // ✅ keep them hidden/optional if No
                this.form.get('dStatus')?.setValue(null);
                this.form.get('status')?.clearValidators();
                this.form.get('merchant')?.clearValidators();
                this.form.get('status')?.updateValueAndValidity();
                this.form.get('merchant')?.updateValueAndValidity();

                this.msgService.add({ severity: 'info', summary: 'Cancelled', detail: 'Approval cancelled.' });
            }
        });
    }

    // ✅ REJECT with Yes/No + messages
    confirmReject(): void {
        this.confirmationService.confirm({
            key: 'reject',
            message: 'Reject this product?',
            header: 'Confirmation',
            icon: 'pi pi-times-circle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',

            accept: () => {
                this.form.get('dStatus')?.setValue(0);

                // optional: clear validators if those fields should not be required on reject
                this.form.get('status')?.clearValidators();
                this.form.get('merchant')?.clearValidators();
                this.form.get('status')?.updateValueAndValidity();
                this.form.get('merchant')?.updateValueAndValidity();

                // If reject should persist, call saveProduct()
                // this.saveProduct();

                this.msgService.add({ severity: 'success', summary: 'Rejected', detail: 'Product rejected successfully.' });
            },

            reject: () => {
                this.msgService.add({ severity: 'info', summary: 'Cancelled', detail: 'Rejection cancelled.' });
            }
        });
    }

    // Opens the dialog for creating a new product
    openNew(): void {
        this.form.reset();
        this.selectedProduct = null;
        this.productDialog = true;
    }

    // Opens the dialog for editing an existing product
    editProduct(product: Product): void {
        this.selectedProduct = product;
        this.form.patchValue(product);
        this.productDialog = true;
    }

    hideDialog(): void {
        this.productDialog = false;
        this.form.reset();
        this.selectedProduct = null;
    }

    // CREATE / UPDATE
    saveProduct(): void {
        const productData = this.form.value as Product;

        if (this.selectedProduct) {
            // PUT: Update existing product via service
            this.productService.updateProduct(productData).subscribe((updatedProduct) => {
                // Update signal logic remains in the component
                this.products.update((currentProducts) => {
                    const index = this.findIndexById(updatedProduct.id);
                    if (index !== -1) {
                        const newProducts = [...currentProducts];
                        newProducts[index] = updatedProduct;
                        return newProducts;
                    }
                    return currentProducts;
                });
                this.hideDialog();
                this.msgService.add({ severity: 'success', summary: 'Updated', detail: 'Record was updated successfully.' });
            });
        } else {
            // POST: Create new product. Generate ID *before* calling the service.
            const newProduct: Product = {
                ...productData,
                id: this.createId()
            };

            this.productService.createProduct(newProduct).subscribe((createdProduct) => {
                // Update signal logic remains in the component
                this.products.update((currentProducts) => [...currentProducts, createdProduct]);
                this.hideDialog();
                this.msgService.add({ severity: 'success', summary: 'Created', detail: 'Record was created successfully.' });
            });
        }
    }

    // DELETE: Triggers the confirmation dialog
    deleteProduct(product: Product): void {
        this.confirmDelete(product);
    }

    loadProducts(): void {
        this.loading.set(true);

        // Delay the start of the request by 1 second
        setTimeout(() => {
            this.productService
                .getProducts()
                .pipe(finalize(() => this.loading.set(false)))
                .subscribe({
                    next: (data: any) => this.products.set(data),
                    error: () => {
                        this.msgService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to load products'
                        });
                    }
                });
        }, 1000); // 1000ms delay
    }

    // ✅ DELETE with Yes/No + messages + loading
    confirmDelete(product: Product): void {
        this.confirmationService.confirm({
            key: 'delete',
            message: `Are you sure you want to delete "${product.name}"?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',

            accept: () => {
                this.loading.set(true);
                this.productService
                    .deleteProduct(product.id)
                    .pipe(finalize(() => this.loading.set(false)))
                    .subscribe({
                        next: () => {
                            this.products.update((list) => list.filter((p) => p.id !== product.id));
                            this.msgService.add({ severity: 'success', summary: 'Deleted', detail: 'Record was deleted successfully.' });
                        },
                        error: () => {
                            this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed.' });
                        }
                    });
            },

            reject: () => {
                this.msgService.add({ severity: 'info', summary: 'Cancelled', detail: 'Delete cancelled.' });
            }
        });
    }
}
