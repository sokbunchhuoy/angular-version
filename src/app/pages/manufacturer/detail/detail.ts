import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ManufacturerService } from '@/pages/manufacturer/manufacturer.service';
import { Manufacturer } from '@/pages/manufacturer/manufacturer.model';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-detail',
    imports: [Button, RouterLink, CommonModule],
    templateUrl: './detail.html',
    styleUrl: './detail.scss'
})
export class Detail implements OnInit {
    private route = inject(ActivatedRoute);
    private service = inject(ManufacturerService);

    // This is the property the template will look for
    manufacturer = signal<Manufacturer | null>(null);

    ngOnInit() {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.service.getById(id).subscribe({
                next: (res) => this.manufacturer.set(res),
                error: (err) => console.error('Error loading manufacturer:', err)
            });
        }
    }
}
