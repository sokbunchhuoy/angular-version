import { Component, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ModelService } from '@/pages/model/model.serivce';
import { Model } from '@/pages/model/model.model';
import { forkJoin, of, switchMap } from 'rxjs';

@Component({
    selector: 'app-detail',
    imports: [Button, RouterLink],
    templateUrl: './detail.html',
    styleUrl: './detail.scss'
})
export class Detail implements OnInit {
    private route = inject(ActivatedRoute);
    private service = inject(ModelService);

    model = signal<any | null>(null);

    ngOnInit() {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.service.getById(id).pipe(
                switchMap(model => {
                    // If the product object is already there, return it
                    if (model.product) return of(model);

                    // Otherwise, fetch product details using the productId
                    return forkJoin({
                        model: of(model),
                        products: this.service.getProducts()
                    });
                })
            ).subscribe({
                next: (res: any) => {
                    if (res.model) {
                        // Join the specific product to the model
                        const modelData = res.model;
                        modelData.product = res.products.find((p: any) => p.id === modelData.productId);
                        this.model.set(modelData);
                    } else {
                        this.model.set(res);
                    }
                },
                error: (err) => console.error('Error loading details:', err)
            });
        }
    }
}
