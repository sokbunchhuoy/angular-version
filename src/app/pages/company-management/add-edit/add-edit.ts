import { Component, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Fieldset } from 'primeng/fieldset';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Textarea } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ManufacturerService } from '@/pages/manufacturer/manufacturer.service';
import { CompanyManagementService } from '@/pages/company-management/company-management.service';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
    selector: 'app-add-edit',
    imports: [Button, Fieldset, InputText, ReactiveFormsModule, RouterLink, Textarea, Toast, DatePicker, FloatLabel],
    templateUrl: './add-edit.html',
    styleUrl: './add-edit.scss',
    providers: [MessageService, ConfirmationService]
})
export class AddEdit implements OnInit {
    private fb = inject(FormBuilder);
    private service = inject(CompanyManagementService);
    private route = inject(ActivatedRoute); // To read the ID from URL
    private router = inject(Router);
    private messageService = inject(MessageService);

    imagePreview = signal<string | null>(null);
    selectedFile: File | null = null;
    form!: FormGroup;
    saving = signal(false);
    isEditMode = signal(false); // Track if we are editing or creating
    id = signal<string | null>(null);

    ngOnInit() {
        this.initForm();
        this.checkEditMode();
    }

    initForm() {
        this.form = this.fb.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            phone: [''],
            contactName: [''],
            email: ['', [Validators.email]],
            address: [''],
            registerDate: ['', Validators.required],
            description: ['']
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
                // 1. Convert the UTC string to a local Date object without the shift
                if (data.registerDate) {
                    const dateObj = new Date(data.registerDate);

                    // Resetting to UTC midnight ensures the DatePicker displays
                    // the date you see in the list (e.g., the 5th)
                    data.registerDate = new Date(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate());
                }

                // 2. Patch the form values
                this.form.patchValue(data);

                // 3. Handle image preview
                if (data.logo) {
                    this.imagePreview.set(data.logo);
                }
            },
            error: (err) => {
                console.error('Failed to load company data:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Could not load company details'
                });
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
            ...this.form.value,
            logo: this.imagePreview() // Sending the Base64 preview
        };
        // const data = this.form.value;
        const currentId = this.id();

        const request = this.isEditMode() && currentId ? this.service.update(currentId, data as any) : this.service.create(data as any);

        request.subscribe({
            next: () => {
                // Determine the message based on the mode
                const detailMessage = this.isEditMode() ? 'Company updated successfully' : 'Company saved successfully';

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: detailMessage
                });

                // Delay navigation so the user can read the toast
                setTimeout(() => this.router.navigate(['/company-management/list']), 1000);
            },
            error: (err) => {
                this.saving.set(false);
                console.error('Operation failed:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save company data'
                });
            }
        });
    }
}

