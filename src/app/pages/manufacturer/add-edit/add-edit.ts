import { Component, inject, OnInit, signal } from '@angular/core';
import { ManufacturerService } from '@/pages/manufacturer/manufacturer.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Toast } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { Fieldset } from 'primeng/fieldset';

@Component({
    selector: 'app-add-edit',
    imports: [InputText, Textarea, FormsModule, Toast, Button, RouterLink, ReactiveFormsModule, Fieldset],
    templateUrl: './add-edit.html',
    styleUrl: './add-edit.scss',
    providers: [MessageService, ConfirmationService]
})
export class AddEdit implements OnInit {
    private fb = inject(FormBuilder);
    private service = inject(ManufacturerService);
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
                this.form.patchValue(data);
                if (data.logo) {
                    this.imagePreview.set(data.logo); // Set existing image for display
                }
            },
            // ... error handling ...
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

        const request = this.isEditMode() && currentId
            ? this.service.update(currentId, data as any)
            : this.service.create(data as any);

        request.subscribe({
            next: () => {
                // Determine the message based on the mode
                const detailMessage = this.isEditMode()
                    ? 'Manufacturer updated successfully'
                    : 'Manufacturer saved successfully';

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: detailMessage
                });

                // Delay navigation so the user can read the toast
                setTimeout(() => this.router.navigate(['/manufacturer/list']), 1000);
            },
            error: (err) => {
                this.saving.set(false);
                console.error('Operation failed:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save manufacturer data'
                });
            }
        });
    }
}
