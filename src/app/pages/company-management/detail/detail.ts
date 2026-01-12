import { Component, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompanyManagementService } from '@/pages/company-management/company-management.service';
import { CompanyManagement } from '@/pages/company-management/company-management.model';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-detail',
    imports: [Button, RouterLink, DatePipe],
    templateUrl: './detail.html',
    styleUrl: './detail.scss'
})
export class Detail implements OnInit {
    private route = inject(ActivatedRoute);
    private service = inject(CompanyManagementService);

    // This is the property the template will look for
    company = signal<CompanyManagement | null>(null);

    ngOnInit() {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.service.getById(id).subscribe({
                next: (res) => this.company.set(res),
                error: (err) => console.error('Error loading company:', err)
            });
        }
    }
}
