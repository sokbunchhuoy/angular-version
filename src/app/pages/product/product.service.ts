import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manufacturer } from '@/pages/manufacturer/manufacturer.model';
import { Product } from '@/pages/product/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/productes';

    // GET: Fetch list with optional search filters
    getProduct(filters?: any): Observable<Product[]> {
        let params = new HttpParams();

        if (filters) {
            Object.keys(filters).forEach(key => {
                // Using '_like' for partial matches (json-server style)
                // Remove '_like' if your production API uses exact matches
                params = params.set(`${key}_like`, filters[key]);
            });
        }

        return this.http.get<Manufacturer[]>(this.apiUrl, { params });
    }

    // GET: Single Product by ID
    getById(id: string | number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    // POST: Create a new Product
    create(data: Product): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, data);
    }

    // PUT: Update existing Product
    update(id: string | number, data: Product): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, data);
    }

    // DELETE: Remove a Product
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
