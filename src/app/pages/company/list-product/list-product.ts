import { Component, OnInit, signal } from '@angular/core';
import { ListProductService, Product } from '@/pages/company/list-product';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
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

@Component({
    selector: 'app-list-product',
    imports: [Button, ConfirmDialog, Dialog, InputNumber, InputText, PrimeTemplate, ReactiveFormsModule, TableModule, Toast, Toolbar, CurrencyPipe, RadioButton, Select, Tag],
    templateUrl: './list-product.html',
    styleUrl: './list-product.scss',
    providers: [MessageService, ConfirmationService]
})
export class ListProduct implements OnInit {
    rows: number = 5;
    rowsPerPageOptions: number[] = [5, 10, 20];
    products = signal<Product[]>([]);
    productDialog: boolean = false; // State for showing/hiding the dialog
    form!: FormGroup;
    selectedProduct!: Product | null;

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
    constructor(
        private fb: FormBuilder,
        private productService: ListProductService,
        private msgService: MessageService, // Inject MessageService
        private confirmationService: ConfirmationService // Inject ConfirmationService
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.loadProducts();
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
            status: ['', Validators.required]
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

    // --- CRUD Operations ---

    loadProducts(): void {
        this.productService.getProducts().subscribe((data) => {
            this.products.set(data);
        });
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

    // Confirmation dialog logic
    confirmDelete(product: Product): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this record ' + product.name + '?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            key: 'delete', // If using multiple ConfirmDialogs, use a key
            accept: () => {
                // If user accepts, proceed with deletion
                this.productService.deleteProduct(product.id).subscribe(() => {
                    // Update signal logic
                    this.products.update((currentProducts) => currentProducts.filter((p) => p.id !== product.id));

                    // Success message for Delete
                    this.msgService.add({ severity: 'success', summary: 'Deleted', detail: 'Record was deleted successfully.' });
                });
            }
        });
    }
}
