import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { Fieldset, FieldsetModule } from 'primeng/fieldset';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TerminalPostService } from '@/pages/terminal/terminal.serivce';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Checkbox } from 'primeng/checkbox';

@Component({
    selector: 'app-add-edit',
    imports: [FieldsetModule, CommonModule, InputTextModule, SelectModule, TextareaModule, Button, Fieldset, ReactiveFormsModule, RouterLink, Toast, Checkbox],
    templateUrl: './add-edit.html',
    styleUrl: './add-edit.scss',
    providers: [MessageService]
})
export class AddEdit implements OnInit {
    form!: FormGroup;
    terminalId: string | null = null;
    isEditMode = false;
    constructor(
        private fb: FormBuilder,
        private service: TerminalPostService,
        private route: ActivatedRoute,
        private router: Router,
        private msgService: MessageService
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.terminalId = this.route.snapshot.paramMap.get('id');
        if (this.terminalId) {
            this.isEditMode = true;
            this.loadTerminalData(this.terminalId);
        } else {
            // Ensure at least one row exists in create mode
            this.addStore();
            this.addMerchant();
        }
    }

    initForm() {
        this.form = this.fb.group({
            name: ['', Validators.required],
            serialNumber: ['', Validators.required],
            model: ['', Validators.required],
            type: ['', Validators.required],
            status: [true, Validators.required],
            store: this.fb.array([]), // Initialize as FormArray
            merchant: this.fb.array([]) // Initialize as FormArray
        });
    }

    // ... update loadTerminalData
    loadTerminalData(id: string) {
        this.service.getById(id).subscribe((data: any) => {
            // Clear default initializations
            this.stores.clear();
            this.merchants.clear();

            // Rebuild based on data
            if (data.store?.length > 0) {
                data.store.forEach(() => this.addStore());
            } else {
                this.addStore(); // Keep index 0 if data is empty
            }

            if (data.merchant?.length > 0) {
                data.merchant.forEach(() => this.addMerchant());
            } else {
                this.addMerchant(); // Keep index 0 if data is empty
            }

            this.form.patchValue(data);
        });
    }

    // ... update remove methods
    removeStore(index: number) {
        // Prevent removing index 0
        if (index > 0) {
            this.stores.removeAt(index);
        }
    }

    removeMerchant(index: number) {
        // Prevent removing index 0
        if (index > 0) {
            this.merchants.removeAt(index);
        }
    }

    // --- Store FormArray Helpers ---
    get stores() {
        return this.form.controls['store'] as FormArray;
    }

    addStore() {
        const storeForm = this.fb.group({
            storeName: ['', Validators.required],
            storeCode: ['', Validators.required]
        });
        this.stores.push(storeForm);
    }

    // --- Merchant FormArray Helpers ---
    get merchants() {
        return this.form.controls['merchant'] as FormArray;
    }

    addMerchant() {
        const merchantForm = this.fb.group({
            merchantName: ['', Validators.required],
            merchantCode: ['', Validators.required]
        });
        this.merchants.push(merchantForm);
    }

    onSave() {
        if (this.form.valid) {
            const payload = this.form.value;

            if (this.isEditMode && this.terminalId) {
                // UPDATE logic
                this.service.update(this.terminalId, payload).subscribe({
                    next: () => {
                        // 3. Add success message for Update
                        this.msgService.add({
                            severity: 'success',
                            summary: 'Updated',
                            detail: 'Record was updated successfully.'
                        });

                        // Optional: Small delay before redirecting to allow user to see the message
                        setTimeout(() => this.router.navigate(['/terminal/list']), 1500);
                    },
                    error: (err) => {
                        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Update failed.' });
                        console.error(err);
                    }
                });
            } else {
                // CREATE logic
                this.service.create(payload).subscribe({
                    next: () => {
                        // 4. Add success message for Create
                        this.msgService.add({
                            severity: 'success',
                            summary: 'Created',
                            detail: 'Record was created successfully.'
                        });

                        setTimeout(() => this.router.navigate(['/terminal/list']), 1500);
                    },
                    error: (err) => {
                        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Creation failed.' });
                        console.error(err);
                    }
                });
            }
        } else {
            // Mark all fields as touched to trigger validation UI
            this.form.markAllAsTouched();
            this.msgService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill in all required fields.' });
        }
    }
}
