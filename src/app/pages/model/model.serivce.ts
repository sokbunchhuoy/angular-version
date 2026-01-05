import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Model } from '@/pages/model/model.model';
import { Product } from '@/pages/product/product.model';
@Injectable({
    providedIn: 'root'
})
export class ModelService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/model';
    private apiUrls = 'http://localhost:3000/productes';
    // GET: Fetch list with optional search filters
    getModel(filters?: any): Observable<Model[]> {
        let params = new HttpParams();
        params = params.set('_expand', 'product'); // Automatically nests the 'product' object

        if (filters) {
            Object.keys(filters).forEach(key => {
                if (filters[key]) params = params.set(`${key}_like`, filters[key]);
            });
        }
        return this.http.get<Model[]>(this.apiUrl, { params });
    }

    // GET: Single Model by ID
    getById(id: string | number): Observable<Model> {
        return this.http.get<Model>(`${this.apiUrl}/${id}`);
    }

    // POST: Create a new Model
    create(data: Model): Observable<Model> {
        return this.http.post<Model>(this.apiUrl, data);
    }

    // PUT: Update existing Model
    update(id: string | number, data: Model): Observable<Model> {
        return this.http.put<Model>(`${this.apiUrl}/${id}`, data);
    }

    // DELETE: Remove a Model
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrls);
    }
}
