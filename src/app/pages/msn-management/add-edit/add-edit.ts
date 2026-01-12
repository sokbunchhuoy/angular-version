import { Component, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Fieldset } from 'primeng/fieldset';
import { InputText } from 'primeng/inputtext';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { ModelService } from '@/pages/model/model.serivce';
import { Product } from '@/pages/product/product.model';
import { combineLatest, startWith } from 'rxjs';
import { ProductService } from '@/pages/product/product.service';
import { MsnManagementService } from '@/pages/msn-management/msn-management.service';
import { Model } from '@/pages/model/model.model';
import { Manufacturer } from '@/pages/manufacturer/manufacturer.model';
import { hexValidator } from '@/pages/msn-management/hex.validator';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-add-edit',
    imports: [Button, InputText, PrimeTemplate, ReactiveFormsModule, RouterLink, Select, Textarea, Toast, DatePickerModule ],
    templateUrl: './add-edit.html',
    styleUrl: './add-edit.scss',
    providers: [MessageService, ConfirmationService]
})
export class AddEdit implements OnInit {
    private fb = inject(FormBuilder);
    private service = inject(MsnManagementService);
    private route = inject(ActivatedRoute); // To read the ID from URL
    private router = inject(Router);
    private messageService = inject(MessageService);
    manufacturer = signal<Manufacturer[]>([]);
    products = signal<Product[]>([]);
    model = signal<Model[]>([]);
    form!: FormGroup;
    saving = signal(false);
    isEditMode = signal(false); // Track if we are editing or creating
    id = signal<string | null>(null);

    ngOnInit() {
        this.initForm();
        this.checkEditMode();
        this.loadInitialDropdowns();
    }

    initForm() {
        this.form = this.fb.group({
            manufacturerId: ['', Validators.required],
            productId: ['', Validators.required],
            modelId: ['', Validators.required],
            batchNo: [null, Validators.compose([Validators.required, hexValidator()])],
            qty: [''],
            mappedQty: [''],
            code: ['', Validators.required],
            description: [''],
            generateBy: [''],
            generateDate: [null, Validators.required]
        });
    }

    private loadInitialDropdowns() {
        // Fetch Manufacturers
        this.service.getManufacturer().subscribe({
            next: (res: any) => {
                // Adjust 'res.result' if your API wraps data in a result object
                this.manufacturer.set(res.result || res);
            }
        });

        // Fetch Products
        this.service.getProducts().subscribe({
            next: (res: any) => {
                this.products.set(res.result || res);
            }
        });
    }

    onProductChange(productId: number) {
        if (!productId) {
            this.model.set([]); // Clear options
            this.form.patchValue({ modelId: null }); // Clear selection
            return;
        }

        // Fetch models based on the selected product
        this.service.getDropdownModel(productId).subscribe({
            next: (res: any) => {
                // Adjust 'res.result' based on your actual API response structure
                this.model.set(res.result || res);
                this.form.get('modelId')?.reset();
            },
            error: (err) => console.error('Error loading models:', err)
        });
    }

    onHexInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const upperCaseValue = input.value.toUpperCase().replace(/[^0-9A-F]/g, '');
        input.value = upperCaseValue;
        this.form.get('batchNo')?.setValue(upperCaseValue, { emitEvent: false });
        if (upperCaseValue.length === 2 && parseInt(upperCaseValue, 16) > 255) {
            this.form.get('batchNo')?.setErrors({ invalidHex: { value: upperCaseValue } });
        }
    }


    private checkEditMode() {
        // Read the 'id' parameter from the route
        const idParam = this.route.snapshot.params['id'];

        if (idParam) {
            this.id.set(idParam);
            this.isEditMode.set(true);
            this.loadData(idParam);
        }
    }

    private loadData(id: any) {
        this.service.getById(id).subscribe({
            next: (data: any) => {
                // Check the field name - your API uses 'generatedDate' or 'generateDate'
                const rawDate = data.generatedDate || data.generateDate;

                if (rawDate) {
                    // SOLUTION: Create the date and then reset it to the "local" midnight
                    // to prevent the 17:00 UTC from jumping to the next day's 00:00.
                    const dateObj = new Date(rawDate);

                    // If the time is late (like 17:00 UTC), and your timezone is +7,
                    // it naturally rolls to the next day. We force it back to the original date:
                    data.generateDate = new Date(
                        dateObj.getUTCFullYear(),
                        dateObj.getUTCMonth(),
                        dateObj.getUTCDate()
                    );
                }

                if (data.productId) {
                    this.service.getDropdownModel(data.productId).subscribe({
                        next: (res: any) => {
                            this.model.set(res.result || res);
                            this.form.patchValue(data);
                        }
                    });
                } else {
                    this.form.patchValue(data);
                }
            }
        });
    }

    onSave() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.saving.set(true);
        const data = {
            ...this.form.value
        };
        // const data = this.form.value;
        const currentId = this.id();

        const request = this.isEditMode() && currentId
            ? this.service.update(currentId, data as any)
            : this.service.create(data as any);

        request.subscribe({
            next: () => {
                // Determine the message based on the mode
                const detailMessage = this.isEditMode()
                    ? 'Msn Management updated successfully'
                    : 'Msn Management saved successfully';

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: detailMessage
                });

                // Delay navigation so the user can read the toast
                setTimeout(() => this.router.navigate(['/msn-management/list']), 1000);
            },
            error: (err) => {
                this.saving.set(false);
                console.error('Operation failed:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save Product data'
                });
            }
        });
    }
}

