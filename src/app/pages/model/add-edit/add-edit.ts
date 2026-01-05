import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ModelService } from '@/pages/model/model.serivce';
import { Button } from 'primeng/button';
import { Fieldset } from 'primeng/fieldset';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { Select } from 'primeng/select';
import { Product } from '@/pages/product/product.model';
import { combineLatest, startWith } from 'rxjs';

@Component({
    selector: 'app-add-edit',
    imports: [Button, Fieldset, InputText, ReactiveFormsModule, RouterLink, Textarea, Toast, Select, PrimeTemplate],
    templateUrl: './add-edit.html',
    styleUrl: './add-edit.scss',
    providers: [MessageService, ConfirmationService]
})
export class AddEdit implements OnInit {
    private fb = inject(FormBuilder);
    private service = inject(ModelService);
    private route = inject(ActivatedRoute); // To read the ID from URL
    private router = inject(Router);
    private messageService = inject(MessageService);
    products = signal<Product[]>([]);
    imagePreview = signal<string | null>(null);
    selectedFile: File | null = null;
    form!: FormGroup;
    saving = signal(false);
    isEditMode = signal(false); // Track if we are editing or creating
    id = signal<string | null>(null);
    majorOptions = Array.from({ length: 26 }, (_, i) => i); // 0 to 25
    minorOptions = signal<number[]>([]);
    ngOnInit() {
        this.initForm();
        this.checkEditMode();
        this.loadDropdownData();
        this.setupValueChanges(); // Add this listener
        this.updateMinorOptions(this.form.get('major')?.value);
    }

    initForm() {
        this.form = this.fb.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            productId: ['', Validators.required],
            major: [null, Validators.required],
            minor: [null, Validators.required],
            description: [''],
            logo: [''],
        });
    }

    setupValueChanges() {
        // 1. Handle Major change to update Minor limits
        this.form.get('major')?.valueChanges.subscribe((major) => {
            const maxMinor = major === 25 ? 5 : 9; // If 25 => max 5
            const currentMinor = this.form.get('minor')?.value;

            if (currentMinor > maxMinor) {
                this.form.get('minor')?.setValue(null);
            }
        });

        // 2. Handle Major + Minor concatenation and Hex conversion
        combineLatest([
            this.form.get('major')!.valueChanges.pipe(startWith(this.form.get('major')?.value)),
            this.form.get('minor')!.valueChanges.pipe(startWith(this.form.get('minor')?.value))
        ]).subscribe(([major, minor]) => {
            if (major !== null && minor !== null) {
                // Concatenate: e.g., 25 and 5 -> "255"
                const decimalValue = Number(`${major}${minor}`);
                // Convert to Hex: e.g., 255 -> "FF"
                const hexResult = decimalValue.toString(16).toUpperCase();
                this.form.get('code')?.setValue(hexResult);
            }
        });
    }

    updateMinorOptions(major: number | null) {
        // Requirement: If major is 25, max minor is 5. Otherwise 9.
        const maxMinor = major === 25 ? 5 : 9;
        const options = Array.from({ length: maxMinor + 1 }, (_, i) => i);
        this.minorOptions.set(options);

        // Reset minor value if current value exceeds the new max
        const currentMinor = this.form.get('minor')?.value;
        if (currentMinor > maxMinor) {
            this.form.get('minor')?.setValue(null);
        }
    }

    calculateHexCode(major: any, minor: any) {
        if (major !== null && minor !== null) {
            // Concatenate: e.g., 25 and 5 becomes "255"
            const decimalStr = `${major}${minor}`;
            // Convert to Hex: e.g., 255 becomes "FF"
            const hexCode = Number(decimalStr).toString(16).toUpperCase();
            this.form.get('code')?.setValue(hexCode);
        } else {
            this.form.get('code')?.setValue('');
        }
    }

    loadDropdownData() {
        this.service.getProducts().subscribe({
            next: (data) => this.products.set(data),
            error: () => console.error('Failed to load products')
        });
    }

    onFileSelect(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;

            // Create a preview URL to display in the UI
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview.set(reader.result as string);
            };
            reader.readAsDataURL(file);
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
                this.form.patchValue(data);
                if (data.logo) {
                    this.imagePreview.set(data.logo); // Set existing image for display
                }
            }
            // ... error handling ...
        });
    }

    onSave() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Please fill all required fields.'
            });
            return;
        }

        this.saving.set(true);

        // Prepare the payload
        const payload = {
            ...this.form.value,
            logo: this.imagePreview(), // Base64 string from the file upload
            // Ensure numbers are stored correctly
            major: Number(this.form.value.major),
            minor: Number(this.form.value.minor)
        };

        const currentId = this.id();
        const request = this.isEditMode() && currentId
            ? this.service.update(currentId, payload)
            : this.service.create(payload);

        request.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: this.isEditMode() ? 'Model updated' : 'Model created'
                });
                setTimeout(() => this.router.navigate(['/model/list']), 1000);
            },
            error: (err) => {
                this.saving.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save data'
                });
            }
        });
    }
}
