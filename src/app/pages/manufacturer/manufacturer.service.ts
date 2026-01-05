import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manufacturer } from '@/pages/manufacturer/manufacturer.model';

@Injectable({
    providedIn: 'root'
})
export class ManufacturerService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/manufacturer';

    // GET: Fetch list with optional search filters
    getManufacturers(filters?: any): Observable<Manufacturer[]> {
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

    // GET: Single manufacturer by ID
    getById(id: string | number): Observable<Manufacturer> {
        return this.http.get<Manufacturer>(`${this.apiUrl}/${id}`);
    }

    // POST: Create a new manufacturer
    create(data: Manufacturer): Observable<Manufacturer> {
        return this.http.post<Manufacturer>(this.apiUrl, data);
    }

    // PUT: Update existing manufacturer
    update(id: string | number, data: Manufacturer): Observable<Manufacturer> {
        return this.http.put<Manufacturer>(`${this.apiUrl}/${id}`, data);
    }

    // DELETE: Remove a manufacturer
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
