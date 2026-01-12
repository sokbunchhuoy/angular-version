import { Component, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { MsnManagementService } from '@/pages/msn-management/msn-management.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-detail',
    imports: [Button, RouterLink, DatePipe],
    templateUrl: './detail.html',
    styleUrl: './detail.scss'
})
export class Detail implements OnInit {
    private route = inject(ActivatedRoute);
    private service = inject(MsnManagementService);

    msnManagement = signal<any | null>(null);

    ngOnInit() {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.service.getById(id).pipe(
                switchMap((modelData: any) => {
                    // Fetch all dropdown lists to find the labels for the IDs
                    return forkJoin({
                        modelData: of(modelData),
                        manufacturers: this.service.getManufacturer(),
                        products: this.service.getProducts(),
                        models: this.service.getModel()
                    });
                })
            ).subscribe({
                next: (res: any) => {
                    const data = res.modelData;

                    // Map the IDs to their respective objects
                    data.manufacturer = res.manufacturers.find((m: any) => m.id === data.manufacturerId);
                    data.product = res.products.find((p: any) => p.id === data.productId);
                    data.model = res.models.find((mod: any) => mod.id === data.modelId);

                    this.msnManagement.set(data);
                },
                error: (err) => console.error('Error loading details:', err)
            });
        }
    }
}
