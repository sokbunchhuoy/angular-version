import { Component, OnInit } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CategoryOption, CompanyService, Employee } from '@/pages/company/company';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { Toast } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-list',
    templateUrl: './list.html',
    imports: [Toolbar, Button, TableModule, Dialog, InputNumber, Checkbox, ReactiveFormsModule, Toast,
    InputTextModule, SelectModule,ConfirmDialogModule ],
    styleUrl: './list.scss',
    providers: [MessageService, ConfirmationService]
})
export class List implements OnInit {
    objEmployees: Employee[] = [];
    rows: number = 5;
    rowsPerPageOptions: number[] = [5, 10, 20];

    // Dialog & Form State
    employeeDialog: boolean = false;
    dialogHeader: string = '';

    // Mock data for Dropdown (Category)
    categories: CategoryOption[] = [
        { label: 'IT', value: 'IT' },
        { label: 'HR', value: 'HR' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Sales', value: 'Sales' }
    ];
    employeeForm: FormGroup; // Defined with definite assignment via initForm()

    constructor(
        private companyService: CompanyService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder
    ) {
        this.employeeForm = this.initForm(); // Initialize form here
    }

    ngOnInit() {
        this.loadEmployees();
    }

    initForm(): FormGroup {
        return this.fb.group({
            code: [''],
            name: ['', [Validators.required, Validators.maxLength(50)]],
            category: ['', Validators.required],
            quantity: [0, [Validators.required, Validators.min(1)]],
            status: [true]
        });
    }

    // --- Data Loading ---
    loadEmployees() {
        this.companyService.getEmployees().subscribe({
            next: (res: Employee[]) => {
                this.objEmployees = res;
            },
            error: (err) => {
                console.error("Error loading employees:", err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load employee data from server.' });
            }
        });
    }

    // --- Dialog Methods ---

    openNew() {
        this.employeeForm.reset({
            code: null,
            name: '',
            category: null,
            quantity: 0,
            status: true
        });
        this.dialogHeader = 'Create New Employee';
        this.employeeDialog = true;
    }

    editEmployee(employee: Employee) {
        // Patch value to load data into the form for editing
        this.employeeForm.patchValue(employee);
        this.dialogHeader = 'Edit Employee: ' + employee.code;
        this.employeeDialog = true;
    }

    hideDialog() {
        this.employeeDialog = false;
        this.employeeForm.reset();
    }

    // New helper to easily get FormControls for template error checking
    get f() {
        return this.employeeForm.controls;
    }

    saveEmployee() {
        if (this.employeeForm.invalid) {
            this.employeeForm.markAllAsTouched();
            return;
        }

        const employeeToSave: Employee = this.employeeForm.value;

        if (employeeToSave.code) {
            // EDIT Mode
            this.companyService.updateEmployee(employeeToSave).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee Updated' });
                    this.loadEmployees();
                    this.hideDialog();
                },
                error: (err) => {
                    console.error("Update failed:", err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update failed. Check server status.' });
                }
            });
        } else {
            // CREATE Mode
            this.companyService.createEmployee(employeeToSave).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee Created' });
                    this.loadEmployees();
                    this.hideDialog();
                },
                error: (err) => {
                    console.error("Creation failed:", err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Creation failed. Check server status.' });
                }
            });
        }
    }

    // --- Delete Confirmation Method ---

    deleteEmployee(employee: Employee) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + employee.name + '?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.companyService.deleteEmployee(employee.code).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee Deleted' });
                        this.loadEmployees();
                    },
                    error: (err) => {
                        console.error("Deletion failed:", err);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Deletion failed. Check server status.' });
                    }
                });
            }
        });
    }
}
