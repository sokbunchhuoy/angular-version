import { Component, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { DeviceManagementService } from '@/pages/device-management/device-management.service';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { NgClass } from '@angular/common';
import { CompanyManagement } from '@/pages/company-management/company-management.model';
import { DeviceManagement } from '@/pages/device-management/device-management.model';

@Component({
    selector: 'app-add-edit',
    imports: [Button, DatePicker, PrimeTemplate, ReactiveFormsModule, RouterLink, Select, Toast, InputText, SelectButton, NgClass],
    templateUrl: './add-edit.html',
    styleUrl: './add-edit.scss',
    providers: [MessageService, ConfirmationService]
})
export class AddEdit implements OnInit {
    private fb = inject(FormBuilder);
    private service = inject(DeviceManagementService);
    private route = inject(ActivatedRoute); // To read the ID from URL
    private router = inject(Router);
    private messageService = inject(MessageService);
    company = signal<CompanyManagement[]>([]);

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
            companyId: [null, Validators.required],
            msnMapping: this.fb.array([this.createMsnGroup()]),
            onboardDate: [null, Validators.required],
            status: ['Pending']
        });
    }

    statusOptions = [
        { label: 'Onboarded', value: 'Onboarded' },
        { label: 'Pending', value: 'Pending' }
    ];

    private loadInitialDropdowns() {
        this.service.getCompany().subscribe({
            next: (res: any) => {
                this.company.set(res.result || res);
            }
        });
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

    onSave() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = this.form.getRawValue();
        const payload = {
            companyId: formValue.companyId,
            msnMapping: formValue.msnMapping, // Matches array structure in image_31763b
            status: formValue.status,
            onboardDate: formValue.onboardDate ? new Date(formValue.onboardDate).toISOString() : null
        };

        const currentId = this.id();
        // Use 'as any' to bypass the strict check for the missing 'company' object
        const request = this.isEditMode() && currentId
            ? this.service.update(currentId, payload as any)
            : this.service.create(payload as any);

        request.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Device updated' });
                this.router.navigate(['/device-management/list']);
            }
        });
    }

    get msnMapping() {
        return this.form.get('msnMapping') as FormArray;
    }

    createMsnGroup(data?: any): FormGroup {
        return this.fb.group({
            msn: [data?.msn || '', Validators.required],
            simPhone: [data?.simPhone || '']
        });
    }

    addMsnRow() {
        this.msnMapping.push(this.createMsnGroup());
    }

    removeMsnRow(index: number) {
        if (this.msnMapping.length > 1) {
            this.msnMapping.removeAt(index);
        }
    }

    private loadData(id: any) {
        this.service.getById(id).subscribe({
            next: (data: any) => {
                // 1. Handle Date Conversion to prevent "Timezone Shift"
                if (data.onboardDate) {
                    const dateObj = new Date(data.onboardDate);
                    data.onboardDate = new Date(
                        dateObj.getUTCFullYear(),
                        dateObj.getUTCMonth(),
                        dateObj.getUTCDate()
                    );
                }

                // 2. Reconstruct FormArray rows
                this.msnMapping.clear();
                if (data.msnMapping && Array.isArray(data.msnMapping)) {
                    data.msnMapping.forEach((item: any) => {
                        this.msnMapping.push(this.createMsnGroup(item));
                    });
                } else {
                    this.addMsnRow(); // Ensure at least one row exists
                }

                // 3. Patch the remaining values (companyId, status, etc.)
                this.form.patchValue(data);
            }
        });
    }
}
