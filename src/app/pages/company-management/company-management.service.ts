import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyManagement } from '@/pages/company-management/company-management.model';

@Injectable({
    providedIn: 'root'
})
export class CompanyManagementService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/company';

    // GET: Fetch list with optional search filters
    getCompany(filters?: any): Observable<CompanyManagement[]> {
        let params = new HttpParams();

        if (filters) {
            Object.keys(filters).forEach(key => {
                // Using '_like' for partial matches (json-server style)
                // Remove '_like' if your production API uses exact matches
                params = params.set(`${key}_like`, filters[key]);
            });
        }

        return this.http.get<CompanyManagement[]>(this.apiUrl, { params });
    }

    // GET: Single CompanyManagement by ID
    getById(id: string | number): Observable<CompanyManagement> {
        return this.http.get<CompanyManagement>(`${this.apiUrl}/${id}`);
    }

    // POST: Create a new CompanyManagement
    create(data: CompanyManagement): Observable<CompanyManagement> {
        return this.http.post<CompanyManagement>(this.apiUrl, data);
    }

    // PUT: Update existing CompanyManagement
    update(id: string | number, data: CompanyManagement): Observable<CompanyManagement> {
        return this.http.put<CompanyManagement>(`${this.apiUrl}/${id}`, data);
    }

    // DELETE: Remove a CompanyManagement
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
