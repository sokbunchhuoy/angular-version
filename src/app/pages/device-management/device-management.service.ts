import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceManagement } from '@/pages/device-management/device-management.model';
import { CompanyManagement } from '@/pages/company-management/company-management.model';


@Injectable({
    providedIn: 'root'
})
export class DeviceManagementService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/device';
    private company = 'http://localhost:3000/company';

    // GET: Fetch list with optional search filters
    getDevice(filters?: any): Observable<DeviceManagement[]> {
        let params = new HttpParams();

        if (filters) {
            Object.keys(filters).forEach(key => {
                // Using '_like' for partial matches (json-server style)
                // Remove '_like' if your production API uses exact matches
                params = params.set(`${key}_like`, filters[key]);
            });
        }

        return this.http.get<DeviceManagement[]>(this.apiUrl, { params });
    }

    // GET: Single DeviceManagement by ID
    getById(id: string | number): Observable<DeviceManagement> {
        return this.http.get<DeviceManagement>(`${this.apiUrl}/${id}`);
    }

    // POST: Create a new DeviceManagement
    create(data: DeviceManagement): Observable<DeviceManagement> {
        return this.http.post<DeviceManagement>(this.apiUrl, data);
    }

    // PUT: Update existing DeviceManagement
    update(id: string | number, data: DeviceManagement): Observable<DeviceManagement> {
        return this.http.put<DeviceManagement>(`${this.apiUrl}/${id}`, data);
    }

    // DELETE: Remove a DeviceManagement
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getCompany(): Observable<CompanyManagement[]> {
        return this.http.get<CompanyManagement[]>(this.company);
    }

}
