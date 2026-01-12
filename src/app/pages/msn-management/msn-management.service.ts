import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '@/pages/product/product.model';
import { MsnManagement } from '@/pages/msn-management/msn-management.model';
import { Manufacturer } from '@/pages/manufacturer/manufacturer.model';
import { Model } from '@/pages/model/model.model';

@Injectable({
    providedIn: 'root'
})
export class MsnManagementService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/msn-management';
    private product = 'http://localhost:3000/productes';
    private manufacturer = 'http://localhost:3000/manufacturer';
    private model = 'http://localhost:3000/model';
    // GET: Fetch list with optional search filters
    getMsnManagement(filters?: any): Observable<MsnManagement[]> {
        let params = new HttpParams();
        params = params.set('query', 'list'); // Automatically nests the 'product' object

        if (filters) {
            Object.keys(filters).forEach(key => {
                if (filters[key]) params = params.set(`${key}_like`, filters[key]);
            });
        }
        return this.http.get<MsnManagement[]>(this.apiUrl, { params });
    }

    // GET: Single Model by ID
    getById(id: string | number): Observable<MsnManagement> {
        return this.http.get<MsnManagement>(`${this.apiUrl}/${id}`);
    }

    // POST: Create a new Model
    create(data: MsnManagement): Observable<MsnManagement> {
        return this.http.post<MsnManagement>(this.apiUrl, data);
    }

    // PUT: Update existing Model
    update(id: string | number, data: MsnManagement): Observable<MsnManagement> {
        return this.http.put<MsnManagement>(`${this.apiUrl}/${id}`, data);
    }

    // DELETE: Remove a Model
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.product);
    }

    getManufacturer(): Observable<Manufacturer[]> {
        return this.http.get<Manufacturer[]>(this.manufacturer);
    }

    getModel(): Observable<Model[]> {
        return this.http.get<Model[]>(this.model);
    }

    getDropdownModel(productId: number): Observable<any> {
        // Adjust this URL to match your backend filtering logic
        return this.http.get<any>(`${this.model}?productId=${productId}`);
    }
}
