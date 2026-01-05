import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '@/pages/product/product.service';
import { Product } from '@/pages/product/product.model';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-detail',
    imports: [Button, RouterLink],
    templateUrl: './detail.html',
    styleUrl: './detail.scss'
})
export class Detail implements OnInit {
    private route = inject(ActivatedRoute);
    private service = inject(ProductService);

    // This is the property the template will look for
    product = signal<Product | null>(null);

    ngOnInit() {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.service.getById(id).subscribe({
                next: (res) => this.product.set(res),
                error: (err) => console.error('Error loading product:', err)
            });
        }
    }
}
